import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const MOJANG_DIR = process.env.MOJANG_DIR;
const SOURCE_DIR = "duckmod-addon";

if (!MOJANG_DIR) {
  console.error('Error: "MOJANG_DIR" is not defined in your .env file.');
  process.exit(1);
}

async function deploy() {
  try {
    const developmentBp = path.join(MOJANG_DIR, "development_behavior_packs");
    const developmentRp = path.join(MOJANG_DIR, "development_resource_packs");

    const sourceBp = path.join(SOURCE_DIR, "duckmod_behavior_pack");
    const sourceRp = path.join(SOURCE_DIR, "duckmod_resource_pack");

    const staleBp = path.join(developmentBp, "duckmod_behavior_pack");
    const staleRp = path.join(developmentRp, "duckmod_resource_pack");

    try {
      await fs.rm(staleBp, { recursive: true, force: true });
    } catch (err) {
      console.log("No behavior pack to remove");
    }

    try {
      await fs.rm(staleRp, { recursive: true, force: true });
    } catch (err) {
      console.log("No resource pack to remove");
    }

    await fs.cp(sourceBp, staleBp, { recursive: true });
    await fs.cp(sourceRp, staleRp, { recursive: true });

    console.log("Successfully deployed behavior and resource packs");
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

deploy();
