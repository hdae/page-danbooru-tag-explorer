import { parse } from "@std/csv"
import Fuse from "fuse.js"

const fuse = await fetch("/danbooru.csv")
    .then(async res => parse(await res.text()))
    .then(danbooru => new Fuse(
        danbooru.map(([w, c, p, a]) => ({ w, c, p, a: a.split(",") })),
        { keys: ["w", "a"] }
    ))

export const search = (search: string, limit: number = 20) => fuse.search(search, { limit })
