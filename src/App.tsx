import { Checkbox, Flex, Heading, RadioGroup, Text, TextField } from "@radix-ui/themes"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { ListItem } from "./components/ListItem"

export type Mode = "scored" | "sorted"

const fuse = new ComlinkWorker<typeof import("./comlink")>(new URL("./comlink", import.meta.url))

const useQueryParam = () => useMemo(
    () => Object.fromEntries(window.location.search
        .slice(1)
        .split("&")
        .map(item => item.split("=")
            .map(v => decodeURIComponent(v)))),
    []
)

export const App = () => {
    const [search, setSearch] = useState("")
    const [mode, setMode] = useState<Mode>("scored")
    const [replace, setReplace] = useState(true)

    const response = useQuery({
        queryKey: ["search", search, mode],
        queryFn: () => fuse.search(search, 20, mode)
    })

    const param = useQueryParam()
    useEffect(() => {
        setSearch(param["q"])
    }, [param])

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
                maxWidth="100vw"
            >
                <Heading>
                    Danbooru tag explorer
                </Heading>
                <Flex
                    direction="row"
                    justify="between"
                    gap="6"
                >
                    <Flex
                        direction="row"
                        justify="center"
                        gap="2"
                        asChild
                    >
                        <RadioGroup.Root
                            defaultValue="scored"
                            onValueChange={(val) => setMode(val as Mode)}
                        >
                            <RadioGroup.Item value="scored">
                                Scored search
                            </RadioGroup.Item>
                            <RadioGroup.Item value="sorted">
                                Popularity search
                            </RadioGroup.Item>
                        </RadioGroup.Root>
                    </Flex>
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox checked={replace} onCheckedChange={(val) => setReplace(val === true)} />
                            Replace underscore on copy
                        </Flex>
                    </Text>
                </Flex>
                <TextField.Root
                    size="3"
                    placeholder="Search tags..."
                    onInput={(ev) => setSearch(ev.currentTarget.value)}
                    defaultValue={search}
                />
                {response.isLoading && (
                    <Text>
                        Loading...
                    </Text>
                )}
                {response.data?.map((result, index) => (
                    <ListItem key={index} result={result} replace={replace} />
                ))}
            </Flex>
        </Flex>
    )
}
