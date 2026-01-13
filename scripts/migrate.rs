#!/usr/bin/env -S cargo +nightly -Zscript
---cargo
[dependencies]
---

use std::env;
use std::fs;
use std::io::{self, BufRead as _, Write};
use std::path::PathBuf;
use std::process::{Command, Stdio};

const MIGRATIONS_DIR: &str = "./pkgs/xusqldb/src/migrations";
const MIGRATIONS_TABLE: &str = "_migrations";

type Result<T> = core::result::Result<T, Box<dyn core::error::Error>>;

fn main() {
    let ctx = MigrationContext::new();
    let mode = Mode::from(env::args());

    let result = match mode {
        Mode::Migrate => migrate_mode(&ctx),
        Mode::Backfill => backfill_mode(&ctx),
    };

    if let Err(e) = result {
        eprintln!("\x1b[31m[ERROR]\x1b[0m {}", e);
        std::process::exit(1);
    }
}

#[derive(Debug, Clone, Copy)]
enum Mode {
    Migrate,
    Backfill,
}
impl From<env::Args> for Mode {
    fn from(args: env::Args) -> Self {
        let mut args = args;
        args.nth(1)
            .filter(|arg| arg == "--backfill")
            .map(|_| Self::Backfill)
            .unwrap_or_else(|| Self::Migrate)
    }
}

#[derive(Debug, Clone)]
struct MigrationContext {
    db: String,
    dir: PathBuf,
}

impl MigrationContext {
    fn new() -> Self {
        Self {
            db: env::var("DB_NAME").unwrap_or_else(|_| "sahara".to_string()),
            dir: PathBuf::from(MIGRATIONS_DIR),
        }
    }

    fn execute_sql(&self, sql: &str) -> Result<String> {
        Command::new("turso")
            .args(["db", "shell", &self.db])
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .and_then(|mut child| {
                child
                    .stdin
                    .as_mut()
                    .ok_or_else(|| io::Error::new(io::ErrorKind::BrokenPipe, "stdin unavailable"))
                    .and_then(|stdin| stdin.write_all(sql.as_bytes()))?;
                child.wait_with_output()
            })
            .map_err(Into::into)
            .and_then(|out| {
                if out.status.success() {
                    Ok(String::from_utf8_lossy(&out.stdout).into_owned())
                } else {
                    Err(String::from_utf8_lossy(&out.stderr).into_owned().into())
                }
            })
    }

    fn ensure_tracking_table(&self) -> Result<()> {
        let sql = format!(
            "CREATE TABLE IF NOT EXISTS {MIGRATIONS_TABLE} (\
             name TEXT PRIMARY KEY, \
             applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP\
             );",
        );
        self.execute_sql(&sql).map(|_| ())
    }

    fn get_applied(&self) -> Result<Vec<String>> {
        let sql = format!("SELECT name FROM {};", MIGRATIONS_TABLE);
        self.execute_sql(&sql).map(|output| {
            output
                .lines()
                .map(str::trim)
                .filter(|s| !s.is_empty())
                .map(String::from)
                .collect()
        })
    }

    fn discover(&self) -> Result<Vec<String>> {
        fs::read_dir(&self.dir)?
            .filter_map(|entry| entry.ok())
            .map(|entry| entry.path())
            .filter(|path| path.is_dir())
            .filter_map(|path| path.file_name().and_then(|n| n.to_str()).map(String::from))
            .collect::<Vec<_>>()
            .pipe(Ok)
    }

    fn record(&self, name: &str) -> Result<()> {
        let sql = format!(
            "INSERT OR IGNORE INTO {} (name) VALUES ('{}');",
            MIGRATIONS_TABLE,
            name.replace('\'', "''")
        );
        self.execute_sql(&sql).map(|_| ())
    }

    fn path(&self, name: &str) -> PathBuf {
        self.dir.join(name).join("migration.sql")
    }

    fn apply(&self, name: &str) -> Result<()> {
        let path = self.path(name);
        fs::read_to_string(&path)
            .map_err(Into::into)
            .and_then(|sql| self.execute_sql(&sql))
            .and_then(|_| self.record(name))
    }
}

#[derive(Debug, Clone, Copy)]
struct MigrationStats {
    total: usize,
    skipped: usize,
    applied: usize,
}

impl MigrationStats {
    fn new(total: usize) -> Self {
        Self {
            total,
            skipped: 0,
            applied: 0,
        }
    }

    fn skip(mut self) -> Self {
        self.skipped += 1;
        self
    }

    fn apply(mut self) -> Self {
        self.applied += 1;
        self
    }

    fn print_summary(&self) {
        println!("================================");
        println!("\x1b[32m[INFO]\x1b[0m Migration Summary:");
        println!("\x1b[32m[INFO]\x1b[0m   Total migrations: {}", self.total);
        println!("\x1b[32m[INFO]\x1b[0m   Already applied: {}", self.skipped);
        println!("\x1b[32m[INFO]\x1b[0m   Newly applied: {}", self.applied);

        let message = if self.applied == 0 {
            "Database is up to date!"
        } else {
            "All new migrations applied successfully!"
        };
        println!("\x1b[32m[INFO]\x1b[0m {}", message);
    }
}

fn migrate_mode(ctx: &MigrationContext) -> Result<()> {
    println!("\x1b[32m[INFO]\x1b[0m Initializing migration tracking...");
    ctx.ensure_tracking_table()?;

    let applied = ctx.get_applied()?;
    let mut migrations = ctx.discover()?;

    if migrations.is_empty() {
        println!(
            "\x1b[33m[WARN]\x1b[0m No migrations found in {}",
            MIGRATIONS_DIR
        );
        return Ok(());
    }

    migrations.sort_unstable();

    println!(
        "\x1b[32m[INFO]\x1b[0m Found {} migration(s) in directory\n",
        migrations.len()
    );

    let stats = migrations
        .iter()
        .try_fold(MigrationStats::new(migrations.len()), |stats, migration| {
            process_migration(ctx, migration, &applied, stats)
        })?;

    stats.print_summary();
    Ok(())
}

fn process_migration(
    ctx: &MigrationContext,
    migration: &str,
    applied: &[String],
    stats: MigrationStats,
) -> Result<MigrationStats> {
    if applied.contains(&migration.to_string()) {
        println!(
            "\x1b[34m[DEBUG]\x1b[0m Skipping (already applied): {}",
            migration
        );
        return Ok(stats.skip());
    }

    let path = ctx.path(migration);
    if !path.exists() {
        println!(
            "\x1b[33m[WARN]\x1b[0m Skipping {}: migration.sql not found",
            migration
        );
        return Ok(stats);
    }

    println!("\x1b[32m[INFO]\x1b[0m Applying migration: {migration}");

    ctx.apply(migration)
        .or_else(|e| handle_migration_error(ctx, migration, e))
        .map(|_| {
            println!("\x1b[32m[INFO]\x1b[0m ✓ Successfully applied: {migration}\n",);
            stats.apply()
        })
}

fn handle_migration_error(
    ctx: &MigrationContext,
    migration: &str,
    error: Box<dyn std::error::Error>,
) -> Result<()> {
    let error = error.to_string();
    if error.contains("already exists") {
        println!("\x1b[33m[WARN]\x1b[0m ⚠ Migration appears already applied: {migration}",);
        ctx.record(migration)
    } else {
        Err(format!("Failed to apply {}: {}", migration, error).into())
    }
}

fn backfill_mode(ctx: &MigrationContext) -> Result<()> {
    println!("Initializing migration tracking table...");
    ctx.ensure_tracking_table()?;

    println!("\nThis script will mark migrations as applied without running them.");
    println!("Use this when migrations have already been applied to the database.\n");

    print!("Enter migration names to mark as applied (comma-separated, or 'all' for all): ");
    io::stdout().flush()?;

    let migrations = io::stdin()
        .lock()
        .lines()
        .next()
        .ok_or("No input provided")??
        .trim()
        .pipe(|input| {
            if input == "all" {
                ctx.discover()
            } else {
                input
                    .split(',')
                    .map(str::trim)
                    .filter(|s| !s.is_empty())
                    .map(String::from)
                    .collect::<Vec<_>>()
                    .pipe(Ok)
            }
        })?;

    if migrations.is_empty() {
        return Err("No migrations specified".into());
    }

    println!("\nMarking migrations as applied...");
    migrations.iter().try_for_each(|migration| {
        println!("  - {}", migration);
        ctx.record(migration)
    })?;

    println!("\nDone! All specified migrations marked as applied.");
    Ok(())
}

/// Extension trait for the pipeline operator pattern
trait Pipe: Sized {
    fn pipe<F, R>(self, f: F) -> R
    where
        F: FnOnce(Self) -> R,
    {
        f(self)
    }
}

impl<T> Pipe for T {}
