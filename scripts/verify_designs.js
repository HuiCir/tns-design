#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";

const EXPECTED_FILES = ["landing.html", "dashboard.html", "pitch.html"];
const failures = [];

for (const file of EXPECTED_FILES) {
  if (!existsSync(file)) {
    failures.push(`MISSING: ${file}`);
    continue;
  }
  const html = readFileSync(file, "utf8").trim();
  if (!/^<(!DOCTYPE|html)/i.test(html)) failures.push(`${file}: missing <!DOCTYPE>`);
  if (!/<title>/i.test(html)) failures.push(`${file}: missing <title>`);
  if (!/<style/i.test(html) && !/<link.*stylesheet/i.test(html)) failures.push(`${file}: no styles`);
  if (html.length < 3000) failures.push(`${file}: too small (${html.length}B)`);
  const divOpen = (html.match(/<div[\s>]/gi) || []).length;
  const divClose = (html.match(/<\/div>/gi) || []).length;
  if (divOpen !== divClose) failures.push(`${file}: unbalanced <div> (${divOpen}/${divClose})`);
}

const htmlFiles = readdirSync(".").filter(f => f.endsWith(".html"));

if (failures.length > 0) {
  console.error("DESIGN VERIFICATION FAILURES:");
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

console.log(`design check passed: ${htmlFiles.length} HTML file(s)`);
