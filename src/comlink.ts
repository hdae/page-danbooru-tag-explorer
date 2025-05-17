import { parse } from "@std/csv"
import Fuse from "fuse.js"
import type { Mode } from "./App"
import csv_url from "./danbooru.csv?url"

const fuses = fetch(csv_url)
    .then(async res => parse(await res.text()))
    .then(danbooru => ({
        sorted: new Fuse(
            danbooru.map(([w, c, p, a]) => ({ w, c, p, a: a.split(",") })),
            {
                includeScore: true,
                shouldSort: false,
                keys: ["w", "a"],
            }
        ),
        scored: new Fuse(
            danbooru.map(([w, c, p, a]) => ({ w, c, p, a: a.split(",") })),
            {
                includeScore: true,
                shouldSort: true,
                keys: ["w", "a"],
            }
        ),
    }))

export const search = async (search: string, limit: number = 20, mode: Mode) => {
    const { scored, sorted } = await fuses

    if (mode === "scored")
        return scored.search(search, { limit })
    if (mode === "sorted")
        return sorted.search(search, { limit })

    throw new Error("Error: not implemented")
}
