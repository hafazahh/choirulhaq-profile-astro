import { id } from "./id";
import { en } from "./en";

export type Lang = "id" | "en";

const dictionaries: Record<Lang, typeof id> = { id, en };

export function t(lang: Lang, path: string): string {
  const keys = path.split(".");
  let result: any = dictionaries[lang];
  for (const key of keys) {
    result = result?.[key];
  }
  return result ?? path;
}

export function getLangFromUrl(url: URL): Lang {
  const lang = url.searchParams.get("lang");
  return lang === "en" ? "en" : "id";
}
