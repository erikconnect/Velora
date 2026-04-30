import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(showcaseRoot, "../..");
const sourceDir = path.join(repoRoot, "packages", "css", "src");
const targetDir = path.join(showcaseRoot, "public", "css");

function getCssFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".css"))
    .map((entry) => entry.name)
    .sort();
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Missing source dir: ${sourceDir}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  const cssFiles = getCssFiles(sourceDir);
  let copied = 0;

  for (const fileName of cssFiles) {
    const sourcePath = path.join(sourceDir, fileName);
    const targetPath = path.join(targetDir, fileName);
    const sourceContent = fs.readFileSync(sourcePath, "utf8");
    const targetContent = fs.existsSync(targetPath)
      ? fs.readFileSync(targetPath, "utf8")
      : null;

    if (targetContent !== sourceContent) {
      fs.writeFileSync(targetPath, sourceContent, "utf8");
      copied += 1;
      console.log(`Synced ${fileName}`);
    }
  }

  console.log(`Framework CSS sync done. Updated files: ${copied}`);
}

main();
