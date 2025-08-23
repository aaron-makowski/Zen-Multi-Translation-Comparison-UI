import fs from "fs";
import path from "path";
import { translations as defaultTranslations } from "./translations";

const CACHE_PATH = path.join(process.cwd(), "data", "verses.json");

export async function loadCachedTranslations() {
  try {
    const data = await fs.promises.readFile(CACHE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    await fs.promises.mkdir(path.dirname(CACHE_PATH), { recursive: true });
    await fs.promises.writeFile(
      CACHE_PATH,
      JSON.stringify(defaultTranslations, null, 2)
    );
    return defaultTranslations;
  }
}

export async function updateTranslationsCache(newData: any) {
  await fs.promises.mkdir(path.dirname(CACHE_PATH), { recursive: true });
  await fs.promises.writeFile(CACHE_PATH, JSON.stringify(newData, null, 2));
}
