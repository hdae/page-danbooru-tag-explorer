import { parse } from "@std/csv"
import Fuse from "fuse.js"
import csv_url from "./danbooru.csv?url"

const fuse = fetch(csv_url)
    .then(async res => parse(await res.text()))
    .then(danbooru => new Fuse(
        danbooru.map(([w, c, p, a]) => ({ w, c, p, a: a.split(",") })),
        { keys: ["w", "a"] }
    ))

export const search = async (search: string, limit: number = 20) => (await fuse).search(search, { limit })
