import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline/promises";
import AdmZip from "adm-zip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VERSION_NUMBER = "1.1.0";

const PROJECT_ROOT = path.resolve(__dirname, "../");
const SOURCE_DIR = path.join(PROJECT_ROOT, "duckmod-addon");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "releases", `v${VERSION_NUMBER}`);

const SOURCE_BP = path.join(SOURCE_DIR, "duckmod_behavior_pack");
const SOURCE_RP = path.join(SOURCE_DIR, "duckmod_resource_pack");

async function compileAddon() {
  try {
    let folderExists = false;
    try {
      await fs.access(OUTPUT_DIR);
      folderExists = true;
    } catch {
      console.log("Creating release directory...");
    }

    if (folderExists) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const answer = await rl.question(`Version v${VERSION_NUMBER} already exists. Overwrite? (Y/N): `);
      rl.close();

      const cleanAnswer = answer.toLowerCase().trim();
      if (cleanAnswer !== "y") {
        console.log("Compilation cancelled.");
        return;
      }
    }

    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const name = `duckmod-addon-${VERSION_NUMBER}`;
    const zipPath = path.join(OUTPUT_DIR, `${name}.zip`);
    const mcaddonPath = path.join(OUTPUT_DIR, `${name}.mcaddon`);

    console.log("Generating .zip file...");
    const zip = new AdmZip();

    zip.addLocalFolder(SOURCE_BP, "duckmod_behavior_pack");
    zip.addLocalFolder(SOURCE_RP, "duckmod_resource_pack");

    zip.writeZip(zipPath);

    console.log("Generating .mcaddon file...");
    await fs.copyFile(zipPath, mcaddonPath);

    console.log(`\n Compilation complete. Files generated inside: ${OUTPUT_DIR}`);
    console.log(` -> ${name}.zip`);
    console.log(` -> ${name}.mcaddon`);
  } catch (error) {
    console.error("Compilation failed:", error);
  }
}

compileAddon();
