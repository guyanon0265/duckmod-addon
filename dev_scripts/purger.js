import { existsSync, readFileSync } from "node:fs";

const CDN_BASE = "/gh/guyanon0265/duckmod-addon@main/releases/";
const PURGE_URL = "https://purge.jsdelivr.net/";
const RELEASES_DIR = new URL("../releases/", import.meta.url);

const fileName = (v) => "duckmod-addon-" + v.version + ".mcaddon";

function readVersions() {
  const versions = JSON.parse(readFileSync(new URL("versions.json", RELEASES_DIR), "utf8"));
  if (!Array.isArray(versions) || versions.length === 0) {
    throw new Error("releases/versions.json is empty or not an array");
  }
  return versions;
}

function buildPaths(versions) {
  const paths = [CDN_BASE + "versions.json"];

  for (const v of versions) {
    const relative = "v" + v.version + "/" + fileName(v);
    if (!existsSync(new URL(relative, RELEASES_DIR))) {
      console.warn("Warning: releases/" + relative + " not found locally");
    }
    paths.push(CDN_BASE + relative);
  }

  return paths;
}

async function purgeJsDelivr() {
  const paths = buildPaths(readVersions());

  console.log("Purging " + paths.length + " path(s):");
  paths.forEach((p) => console.log("  " + p));

  const response = await fetch(PURGE_URL, {
    method: "POST",
    headers: { "content-type": "application/json", "cache-control": "no-cache" },
    body: JSON.stringify({ path: paths }),
  });
  const body = await response.text();

  if (!response.ok) {
    console.error("Purge failed: " + response.status + " " + body);
    process.exitCode = 1;
    return;
  }

  console.log("jsDelivr responded: " + body);
}

purgeJsDelivr().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
