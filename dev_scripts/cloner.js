import fs from "fs/promises";
import { execFileSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_URL = "https://github.com/mojang/bedrock-samples";
const TARGET_DIR = path.resolve(__dirname, "../bedrock-samples");

async function cloneSamples() {
  try {
    await fs.rm(TARGET_DIR, { recursive: true, force: true });

    console.log("Cloning Mojang Bedrock Samples...");
    execFileSync("git", ["clone", "--depth", "1", REPO_URL, TARGET_DIR], { stdio: "inherit" });

    console.log("Stripping internal Git metadata to ensure read-only safety...");
    const internalGitFolder = path.join(TARGET_DIR, ".git");
    await fs.rm(internalGitFolder, { recursive: true, force: true });

    console.log(`\nSuccessfully deployed samples into: ${TARGET_DIR}`);
  } catch (error) {
    console.error("Failed to clone samples:", error.message);
  }
}

cloneSamples();
