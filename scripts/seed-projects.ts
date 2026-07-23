/**
 * One-off seed: loads the built-in SEED_PROJECTS into the Supabase `projects`
 * table. Run AFTER applying supabase/migrations/0001_projects.sql:
 *
 *   npx tsx scripts/seed-projects.ts
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.
 * Safe to abort — it skips if the table already has rows.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { SEED_PROJECTS, seedProjectToRow } from "../src/lib/projects";

function loadEnvLocal(): void {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim();
      }
    }
  } catch {
    // no .env.local — fall back to the real environment
  }
}

async function main(): Promise<void> {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0) {
    console.log(`projects table already has ${count} rows — skipping seed.`);
    return;
  }

  const rows = SEED_PROJECTS.map((project, i) => seedProjectToRow(project, i));
  const { error } = await supabase.from("projects").insert(rows);
  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
  console.log(`Seeded ${rows.length} projects.`);
}

main();
