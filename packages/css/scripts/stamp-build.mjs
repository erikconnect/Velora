import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const dist = join(dir, "..", "dist");
mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, ".buildstamp"), "");
