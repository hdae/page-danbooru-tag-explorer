import Fuse, { type FuseResult } from "fuse.js";
import Papa from "papaparse";
import csvUrl from "@/assets/danbooru.csv?url";
import type { Mode, TagRow } from "@/lib/types";

const fuses = (async () => {
  const res = await fetch(csvUrl);
  const text = await res.text();
  const { data } = Papa.parse<string[]>(text, { skipEmptyLines: true });
  const rows: TagRow[] = data.map(([w = "", c = "", p = "", a = ""]) => ({
    w,
    c,
    p,
    a: a.split(",").filter((v) => v.trim() !== ""),
  }));
  return {
    scored: new Fuse(rows, { includeScore: true, shouldSort: true, keys: ["w", "a"] }),
    sorted: new Fuse(rows, { includeScore: true, shouldSort: false, keys: ["w", "a"] }),
  } as const;
})();

export const search = async (
  query: string,
  limit: number,
  mode: Mode,
): Promise<FuseResult<TagRow>[]> => {
  if (query.trim().length === 0) return [];
  const { scored, sorted } = await fuses;
  const fuse = mode === "scored" ? scored : sorted;
  return fuse.search(query, { limit });
};
