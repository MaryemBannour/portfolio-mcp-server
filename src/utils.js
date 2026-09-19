import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../data");

export async function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

export async function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export function textResult(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
