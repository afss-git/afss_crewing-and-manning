import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export async function readDb(): Promise<any> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    // If file doesn't exist, return an initial structure
    if ((err as any).code === "ENOENT") {
      return { users: [], admins: [], documents: [] };
    }
    throw err;
  }
}

export async function writeDb(data: any): Promise<void> {
  const dir = path.dirname(DB_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}
