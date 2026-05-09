#!/usr/bin/env node
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { cp, readFile, writeFile, mkdir } from "node:fs/promises";
import { execa } from "execa";

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE_DIR = resolve(PACKAGE_ROOT, "templates", "design-swarm");

const USAGE = `
tns-design — TNS Design Swarm CLI

Commands:
  tns-design init --workspace <path>    Create a design swarm workspace
  tns-design setup [--workspace <path>] Register Open Design skills in existing workspace

Examples:
  tns-design init --workspace ./my-designs
  tns-design setup --workspace ./my-designs
`;

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    console.log(USAGE);
    process.exit(0);
  }

  if (cmd === "init") {
    const wsIdx = args.indexOf("--workspace");
    if (wsIdx === -1) {
      console.error("Error: --workspace is required");
      console.log(USAGE);
      process.exit(1);
    }
    const workspace = resolve(args[wsIdx + 1]);

    // Step 1: Run tns init
    console.log(`Creating TNS workspace at ${workspace}...`);
    await execa("tns", ["init", "--workspace", workspace, "--template", "blank"], { stdio: "inherit" });

    // Step 2: Copy template files
    console.log("Applying design swarm template...");
    await cp(resolve(TEMPLATE_DIR, "task.md"), resolve(workspace, "task.md"), { force: true });

    // Step 3: Merge config
    const templateConfig = JSON.parse(await readFile(resolve(TEMPLATE_DIR, "tns_config.json"), "utf-8"));
    const existingConfig = JSON.parse(await readFile(resolve(workspace, "tns_config.json"), "utf-8"));

    const merged = { ...existingConfig, ...templateConfig };
    // Preserve workspace paths
    merged.workspace = workspace;
    merged.product_doc = resolve(workspace, "task.md");

    await writeFile(resolve(workspace, "tns_config.json"), JSON.stringify(merged, null, 2) + "\n");

    // Step 4: Copy support files
    await cp(resolve(TEMPLATE_DIR, "scripts"), resolve(workspace, "scripts"), { recursive: true, force: true });
    await mkdir(resolve(workspace, "output"), { recursive: true });

    console.log(`\nDesign swarm workspace ready at ${workspace}`);
    console.log(`Next steps:`);
    console.log(`  cd ${workspace}`);
    console.log(`  tns-design setup`);
    console.log(`  tns compile --synthesize --apply`);
    console.log(`  tns run --once`);
    return;
  }

  if (cmd === "setup") {
    const wsIdx = args.indexOf("--workspace");
    const workspace = wsIdx !== -1 ? resolve(args[wsIdx + 1]) : process.cwd();
    const configPath = resolve(workspace, "tns_config.json");

    let config;
    try {
      config = JSON.parse(await readFile(configPath, "utf-8"));
    } catch {
      console.error(`Error: no tns_config.json found in ${workspace}`);
      console.error("Run 'tns-design init --workspace <path>' first.");
      process.exit(1);
    }

    const odSkillsPath = "/Applications/Open Design.app/Contents/Resources/open-design/skills";
    const odSystemsPath = "/Applications/Open Design.app/Contents/Resources/open-design/design-systems";

    // Check if OD is installed
    try {
      await readFile(resolve(odSkillsPath, "web-prototype", "SKILL.md"), "utf-8");
    } catch {
      console.error("Warning: Open Design skills not found at expected path.");
      console.error(`Expected: ${odSkillsPath}`);
      console.error("Install Open Design from https://github.com/nexu-io/open-design");
      console.error("Continuing without OD skill registration...\n");
    }

    // Register OD skillbase sources via tns skill
    try {
      console.log("Registering Open Design skillbase...");
      await execa("tns", [
        "skill", "source-add",
        "--config", configPath,
        "--path", odSkillsPath,
        "--id", "open-design",
        "--kind", "skills_dir",
        "--priority", "50"
      ], { stdio: "inherit" });
    } catch {
      console.log("  (source may already exist)");
    }

    try {
      console.log("Registering Open Design design systems...");
      await execa("tns", [
        "skill", "source-add",
        "--config", configPath,
        "--path", odSystemsPath,
        "--id", "open-design-systems",
        "--kind", "skills_dir",
        "--priority", "45"
      ], { stdio: "inherit" });
    } catch {
      console.log("  (source may already exist)");
    }

    console.log("\nSetup complete. Run:");
    console.log(`  cd ${workspace}`);
    console.log("  tns compile --synthesize --apply");
    console.log("  tns run --once");
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  console.log(USAGE);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
