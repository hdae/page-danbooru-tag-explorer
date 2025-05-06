import { Flex, Heading, TextField } from "@radix-ui/themes"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { ListItem } from "./components/ListItem"

const fuse = new ComlinkWorker<typeof import("./comlink")>(new URL("./comlink", import.meta.url))

export const App = () => {
    const [search, setSearch] = useState("")

    const response = useQuery({
        queryKey: ["search", search],
        queryFn: () => fuse.search(search, 20)
    })

    return (
        <Flex
            direction="column"
            align="center"
        >
            <Flex
                p="6"
                direction="column"
                gap="4"
                width="800px"
            >
                <Heading>
                    Danbooru tag explorer
                </Heading>
                <TextField.Root
                    size="3"
                    placeholder="Search tags..."
                    onInput={(ev) => setSearch(ev.currentTarget.value)}
                />
                {response.data?.map((result) => (
                    <ListItem result={result} />
                ))}
            </Flex>
        </Flex>
    )
}
