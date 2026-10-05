import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import AdmZip from "adm-zip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "../");
const SOURCE_DIR = path.join(PROJECT_ROOT, "duckmod-addon");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "compiled");

const SOURCE_BP = path.join(SOURCE_DIR, "duckmod_behavior_pack");
const SOURCE_RP = path.join(SOURCE_DIR, "duckmod_resource_pack");

const VERSION_NUMBER = "1.0.0";

async function compileAddon() {
  try {
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
