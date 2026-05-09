#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { globSync } from "node:fs";

const EXPECTED_FILES = ["landing.html", "dashboard.html", "pitch.html"];
const failures = [];

for (const file of EXPECTED_FILES) {
  if (!existsSync(file)) {
    failures.push(`MISSING: ${file}`);
    continue;
  }
  const html = readFileSync(file, "utf8").trim();

  // Must start with DOCTYPE or <html>
  if (!/^<(!DOCTYPE|html)/i.test(html)) {
    failures.push(`${file}: does not start with <!DOCTYPE or <html>`);
  }

  // Must have a <title>
  if (!/<title>/i.test(html)) {
    failures.push(`${file}: missing <title>`);
  }

  // Must have <style> or <link> (self-contained or referenced CSS)
  if (!/<style/i.test(html) && !/<link.*stylesheet/i.test(html)) {
    failures.push(`${file}: no <style> or stylesheet <link>`);
  }

  // Size check: design files should be substantial
  if (html.length < 3000) {
    failures.push(`${file}: too small (${html.length} bytes, expected >3000)`);
  }

  // Rough tag balance check
  const divOpen = (html.match(/<div[\s>]/gi) || []).length;
  const divClose = (html.match(/<\/div>/gi) || []).length;
  if (divOpen !== divClose) {
    failures.push(`${file}: unbalanced <div> tags (${divOpen} open, ${divClose} close)`);
  }
}

// Check for the output directory
if (!existsSync("output")) {
  console.log("Note: no output/ directory (section outputs may go here)");
}

const htmlFiles = existsSync(".") ?
  (await import("node:fs")).readdirSync(".").filter(f => f.endsWith(".html"))
  : [];
const htmlCount = htmlFiles.length;

if (failures.length > 0) {
  console.error("DESIGN VERIFICATION FAILURES:");
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

console.log(`design check passed: ${htmlCount} HTML file(s), all checks OK`);
