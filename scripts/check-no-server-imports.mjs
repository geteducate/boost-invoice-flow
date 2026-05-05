#!/usr/bin/env node
// Pre-deployment guard: fails if any client bundle file references `src/server/`
// (indicating a server-only module leaked into the client chunk graph).
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const CLIENT_DIR = "dist/client";
const PATTERN = /src\/server\//;

if (!existsSync(CLIENT_DIR)) {
  console.error(`[check-no-server-imports] ${CLIENT_DIR} not found. Run 'vite build' first.`);
  process.exit(1);
}

const offenders = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(js|mjs|cjs|map|html|css)$/.test(name)) {
      const text = readFileSync(p, "utf8");
      if (PATTERN.test(text)) offenders.push(p);
    }
  }
}
walk(CLIENT_DIR);

if (offenders.length) {
  console.error("[check-no-server-imports] FAILED — client bundle references src/server/:");
  for (const f of offenders) console.error("  - " + f);
  process.exit(1);
}
console.log("[check-no-server-imports] OK — no src/server/* references in client bundle.");
