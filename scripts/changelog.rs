#!/usr/bin/env -S cargo +nightly -Zscript
---cargo
[dependencies]
rayon = "1"
walkdir = "2"
---

use rayon::prelude::*;
use std::path::{Path, PathBuf};
use std::process::Command;
use walkdir::WalkDir;

const IGNORE_LIST: &[&str] = &["67f6075f51de7c62327fba114e9310774f94fb95"];

fn get_cpu_count() -> usize {
    std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(4)
}

fn process_file(path: impl AsRef<Path>, ignore_pattern: &str) -> Option<String> {
    let path = path.as_ref().to_str()?;
    let output = Command::new("git")
        .args([
            "log",
            "--follow",
            "--no-patch",
            "--date=iso",
            "--pretty=format:%cs|%H;",
            "--",
            path,
        ])
        .output()
        .ok()?;

    if !output.status.success() {
        return None;
    }

    let stdout = String::from_utf8_lossy(&output.stdout);

    // Filter out ignored commits and take first line
    let line = stdout
        .lines()
        .find(|line| !ignore_pattern.split('|').any(|hash| line.contains(hash)))?;

    Some(format!("{}|{}", path, line))
}

fn main() {
    let cpu_count = get_cpu_count();
    eprintln!("Using {} threads", cpu_count);

    let ignore_pattern = IGNORE_LIST.join("|");

    // Find all .md and .mdx files
    let files: Vec<PathBuf> = WalkDir::new("apps/site/content")
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .filter(|e| {
            e.path()
                .extension()
                .and_then(|ext| ext.to_str())
                .map(|ext| ext == "md" || ext == "mdx")
                .unwrap_or(false)
        })
        .map(|e| e.path().to_owned())
        .collect();

    // Process in parallel
    rayon::ThreadPoolBuilder::new()
        .num_threads(cpu_count)
        .build_global()
        .unwrap();

    let results: Vec<_> = files
        .par_iter()
        .filter_map(|fname| process_file(fname, &ignore_pattern))
        .collect();

    // Print results
    for result in results {
        print!("{}", result);
    }
}
