#!/usr/bin/env -S cargo +nightly -Zscript
---cargo
package.edition="2024"
[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
anyhow = "1"
---

//! Iconify SVG generator
//!
//! Reads apps/site/config/icons.json, finds the installed @iconify-json/* packages
//! inside the nearest node_modules, writes individual .svg files, and generates
//! apps/site/src/assets/icons/index.ts that re-exports every icon as an Astro SVG
//! component (Astro v5+ native .svg imports).
//!
//! Usage (from anywhere inside the workspace):
//!   ./scripts/iconify.rs

use std::collections::HashMap;
use std::fmt::Write as FmtWrite;
use std::fs;
use std::path::{Path, PathBuf};

use anyhow::{Context, bail};
use serde::Deserialize;

// ── Iconify JSON types ────────────────────────────────────────────────────────

/// Top-level structure of an `@iconify-json/<collection>/icons.json` file.
#[derive(Deserialize)]
struct IconSet {
    /// Default width  (fallback when an icon has no own width)
    width: Option<f64>,
    /// Default height (fallback when an icon has no own height)
    height: Option<f64>,
    /// Every icon keyed by its name.
    icons: HashMap<String, IconData>,
    /// Aliases – an alias shares the `body` of the referenced icon.
    #[serde(default)]
    aliases: HashMap<String, Alias>,
}

#[derive(Deserialize)]
struct IconData {
    /// Raw SVG inner content (everything that goes inside `<svg>…</svg>`).
    body: String,
    width: Option<f64>,
    height: Option<f64>,
}

#[derive(Deserialize)]
struct Alias {
    /// The icon name this alias points to.
    parent: String,
}

// ── icons.json (project config) ──────────────────────────────────────────────

/// `apps/site/config/icons.json`  →  `{ "lucide": ["home", …], … }`
type IconsConfig = HashMap<String, Vec<String>>;

// ── helpers ───────────────────────────────────────────────────────────────────

/// Walk up from `start` until we find a directory that contains `node_modules`.
fn find_workspace_root(start: &Path) -> anyhow::Result<PathBuf> {
    let mut dir = start.to_path_buf();
    loop {
        if dir.join("node_modules").is_dir() {
            return Ok(dir);
        }
        if !dir.pop() {
            bail!(
                "could not find a node_modules directory above {}",
                start.display()
            );
        }
    }
}

/// Build the full SVG string for a single icon.
fn build_svg(body: &str, width: f64, height: f64) -> String {
    format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{body}</svg>"#,
        width = width,
        height = height,
        body = body,
    )
}

/// Convert an icon name like `briefcase-business` to a valid TS identifier
/// `BriefcaseBusiness` (PascalCase).
fn to_pascal_case(s: &str) -> String {
    s.split(['-', '_'])
        .filter(|p| !p.is_empty())
        .map(|part| {
            let mut c = part.chars();
            match c.next() {
                None => String::new(),
                Some(first) => first.to_uppercase().to_string() + c.as_str(),
            }
        })
        .collect()
}

/// TS export identifier: `<Collection><Name>Icon`
///   lucide / briefcase-business  →  `LucideBriefcaseBusinessIcon`
fn export_ident(collection: &str, name: &str) -> String {
    format!("{}{}Icon", to_pascal_case(collection), to_pascal_case(name))
}

// ── main ──────────────────────────────────────────────────────────────────────

fn main() -> anyhow::Result<()> {
    // ── 1. Locate workspace root and key paths ────────────────────────────────
    let script_path = PathBuf::from(std::env::args().next().expect("argv[0] missing"));
    // The script lives at <workspace>/scripts/iconify.rs  – go up two levels.
    // If invoked as a relative path we canonicalise first.
    let script_dir = fs::canonicalize(&script_path)
        .unwrap_or_else(|_| script_path.clone())
        .parent()
        .expect("script has no parent dir")
        .to_path_buf();

    let workspace_root = find_workspace_root(&script_dir)
        .context("searching for workspace root from script location")?;

    let site_dir = workspace_root.join("apps").join("site");
    let node_modules = workspace_root.join("node_modules");

    let icons_config_path = site_dir.join("config").join("icons.json");
    let out_dir = site_dir.join("src").join("assets").join("icons");
    let index_ts_path = out_dir.join("index.ts");

    println!("workspace root : {}", workspace_root.display());
    println!("icons config   : {}", icons_config_path.display());
    println!("output dir     : {}", out_dir.display());

    // ── 2. Parse icons.json ───────────────────────────────────────────────────
    let config_raw = fs::read_to_string(&icons_config_path)
        .with_context(|| format!("reading {}", icons_config_path.display()))?;
    let config: IconsConfig = serde_json::from_str(&config_raw).context("parsing icons.json")?;

    // Sorted for deterministic output
    let mut collections: Vec<&str> = config.keys().map(String::as_str).collect();
    collections.sort_unstable();

    // ── 3. Process each collection ────────────────────────────────────────────
    // Accumulate entries for the index.ts
    // entry = (collection, name, relative_path_from_index)
    let mut index_entries: Vec<(String, String)> = Vec::new();

    for collection in &collections {
        let wanted: &Vec<String> = &config[*collection];
        if wanted.is_empty() {
            continue;
        }

        // Locate the icons.json inside node_modules
        let pkg_icons_json = node_modules
            .join(format!("@iconify-json/{collection}"))
            .join("icons.json");

        if !pkg_icons_json.exists() {
            eprintln!(
                "warn: @iconify-json/{collection} not found at {} – skipping",
                pkg_icons_json.display()
            );
            continue;
        }

        let raw = fs::read_to_string(&pkg_icons_json)
            .with_context(|| format!("reading {}", pkg_icons_json.display()))?;
        let icon_set: IconSet = serde_json::from_str(&raw)
            .with_context(|| format!("parsing {collection} icons.json"))?;

        let default_w = icon_set.width.unwrap_or(24.0);
        let default_h = icon_set.height.unwrap_or(24.0);

        // Output sub-directory for this collection
        let col_dir = out_dir.join(collection);
        fs::create_dir_all(&col_dir).with_context(|| format!("creating {}", col_dir.display()))?;

        for name in wanted {
            // Resolve body: direct icon or alias
            let (body, width, height) = if let Some(icon) = icon_set.icons.get(name) {
                (
                    icon.body.as_str(),
                    icon.width.unwrap_or(default_w),
                    icon.height.unwrap_or(default_h),
                )
            } else if let Some(alias) = icon_set.aliases.get(name) {
                let parent = icon_set.icons.get(&alias.parent).with_context(|| {
                    format!("alias {name} → {} not found in {collection}", alias.parent)
                })?;
                (
                    parent.body.as_str(),
                    parent.width.unwrap_or(default_w),
                    parent.height.unwrap_or(default_h),
                )
            } else {
                eprintln!("warn: icon `{name}` not found in collection `{collection}` – skipping");
                continue;
            };

            let svg = build_svg(body, width, height);
            let svg_path = col_dir.join(format!("{name}.svg"));

            fs::write(&svg_path, &svg)
                .with_context(|| format!("writing {}", svg_path.display()))?;

            println!("  ✓  {collection}/{name}.svg");
            index_entries.push((collection.to_string(), name.clone()));
        }
    }

    // ── 4. Generate index.ts ──────────────────────────────────────────────────
    let ts = build_index_ts(&index_entries, &collections, &config);
    fs::write(&index_ts_path, &ts)
        .with_context(|| format!("writing {}", index_ts_path.display()))?;

    println!("\n✓  wrote {}", index_ts_path.display());
    Ok(())
}

fn build_index_ts(
    entries: &[(String, String)], // (collection, name)
    sorted_collections: &[&str],
    config: &IconsConfig,
) -> String {
    let mut s = String::new();

    s.push_str("// AUTO-GENERATED by scripts/iconify.rs – do not edit by hand\n");
    s.push_str("//\n");
    s.push_str("// Astro v5+ treats .svg files as components when imported.\n");
    s.push_str(
        "// Each named export is an Astro SVG component ready to use as <LucideHomeIcon />.\n",
    );
    s.push_str("// The `iconMap` object maps \"collection:name\" keys to components for\n");
    s.push_str("// dynamic lookup (e.g. from content-collection front-matter).\n\n");

    // ── Per-collection grouped imports ────────────────────────────────────────
    for collection in sorted_collections {
        let names = match config.get(*collection) {
            Some(v) if !v.is_empty() => v,
            _ => continue,
        };

        writeln!(s, "// {collection}").unwrap();

        let mut sorted_names = names.clone();
        sorted_names.sort_unstable();

        for name in &sorted_names {
            // Skip icons that were not successfully written (not in entries)
            if !entries.iter().any(|(c, n)| c == collection && n == name) {
                continue;
            }
            let ident = export_ident(collection, name);
            writeln!(s, r#"import {ident} from "./{collection}/{name}.svg";"#).unwrap();
        }
        s.push('\n');
    }

    // ── Re-export every icon as a named export ────────────────────────────────
    s.push_str("// Named re-exports (use directly as Astro components)\n");
    s.push_str("export {\n");
    for (collection, name) in entries {
        let ident = export_ident(collection, name);
        writeln!(s, "  {ident},").unwrap();
    }
    s.push_str("};\n\n");

    // ── IconName union type ───────────────────────────────────────────────────
    s.push_str("// Exhaustive union of every registered icon in \"collection:name\" form.\n");
    s.push_str("// Use this as the type for icon fields in your content-collection schemas.\n");
    s.push_str("export type IconName =\n");
    for (collection, name) in entries.iter() {
        writeln!(s, r#"  | "{collection}:{name}""#).unwrap();
    }
    s.push_str(";\n\n");

    // ── iconMap ───────────────────────────────────────────────────────────────
    s.push_str("// Dynamic lookup map  →  iconMap[\"lucide:home\"]  gives you the component.\n");
    s.push_str("export const iconMap: Record<IconName, unknown> = {\n");
    for (collection, name) in entries {
        let ident = export_ident(collection, name);
        writeln!(s, r#"  "{collection}:{name}": {ident},"#).unwrap();
    }
    s.push_str("};\n\n");

    // ── iconNames (runtime tuple for Zod schemas) ─────────────────────────────
    s.push_str("// Runtime string array – mirrors IconName for use with z.enum().\n");
    s.push_str("// import { iconNames } from \"@/assets/icons\" then z.enum(iconNames as [string, ...string[]])\n");
    s.push_str("export const iconNames = [\n");
    for (collection, name) in entries {
        writeln!(s, r#"  "{collection}:{name}","#).unwrap();
    }
    s.push_str("] as const;\n");

    s
}
