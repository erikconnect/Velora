import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_EXTENSIONS = new Set([
  ".html",
  ".astro",
  ".jsx",
  ".tsx",
  ".vue",
  ".php",
  ".md",
  ".mdx",
]);

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".turbo",
  ".astro",
  ".next",
  "coverage",
  "output",
  "templates",
]);

export async function scanFiles(rootDir, extensions = DEFAULT_EXTENSIONS) {
  const files = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile() && extensions.has(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return files;
}
