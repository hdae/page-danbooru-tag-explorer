import { Checkbox, Flex, Heading, Text, TextField } from "@radix-ui/themes"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { ListItem } from "./components/ListItem"

const fuse = new ComlinkWorker<typeof import("./comlink")>(new URL("./comlink", import.meta.url))

export const App = () => {
    const [search, setSearch] = useState("")
    const [sorted, setSorted] = useState(false)

    const response = useQuery({
        queryKey: ["search", search, sorted],
        queryFn: () => fuse.search(search, 20, sorted)
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
                <Flex direction="row" justify="center">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox checked={sorted} onCheckedChange={(val) => setSorted(val === true)} />
                            Sort by popularity
                        </Flex>
                    </Text>
                </Flex>
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
