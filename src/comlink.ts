import { parse } from "@std/csv"
import Fuse from "fuse.js"
import csv_url from "./danbooru.csv?url"

const fuses = fetch(csv_url)
    .then(async res => parse(await res.text()))
    .then(danbooru => ({
        scored: new Fuse(
            danbooru.map(([w, c, p, a]) => ({ w, c, p, a: a.split(",") })),
            {
                includeScore: true,
                shouldSort: true,
                keys: ["w", "a"],
            }
        ),
        sorted: new Fuse(
            danbooru.map(([w, c, p, a]) => ({ w, c, p, a: a.split(",") })),
            {
                includeScore: true,
                shouldSort: false,
                keys: ["w", "a"],
            }
        )
    }))

export const search = async (search: string, limit: number = 20, use_sorted = false) => {
    const { scored, sorted } = await fuses
    return use_sorted
        ? sorted.search(search, { limit })
        : scored.search(search, { limit })
}
