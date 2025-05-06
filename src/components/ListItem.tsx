import { Badge, Card, Flex, Text } from "@radix-ui/themes"
import type { FuseResult } from "fuse.js"
import { type FC } from "react"

const copyToClipboard = (text: string) => () => navigator.clipboard.writeText(text)

const category: Record<string, string> = {
    "0": "General",
    "1": "Artist",
    "3": "Copyright",
    "4": "Character",
    "5": "Meta",
}

const category_bg_color: Record<string, string> = {
    "1": "var(--red-3)",
    "3": "var(--blue-3)",
    "4": "var(--green-3)",
    "5": "var(--purple-3)",
}

const category_color: Record<string, "gray" | "red" | "blue" | "green" | "purple"> = {
    "0": "gray",
    "1": "red",
    "3": "blue",
    "4": "green",
    "5": "purple",
}

export const ListItem: FC<{
    result: FuseResult<{
        w: string
        c: string
        p: string
        a: string[]
    }>
}> = ({ result }) => (
    <Card
        onClick={copyToClipboard(result.item.w)}
        style={{
            // @ts-ignore
            "--card-background-color": category_bg_color[result.item.c]
        }}
    >
        <Flex
            direction="column"
            gap="2"
        >
            <Flex
                direction="row"
                gap="1"
                wrap="wrap"
                align="start"
                justify="between"
            >
                <Text as="div" size="5" weight="bold" >
                    {result.item.w}
                </Text>
                <Text as="div" size="2" >
                    {category[result.item.c]}
                </Text>
            </Flex>
            <Flex
                direction="row"
                gap="1"
                wrap="wrap"
            >
                {result.item.a.map(v => (
                    <Badge
                        variant="outline"
                        size="2"
                        color={category_color[result.item.c]}
                    >
                        {v}
                    </Badge>
                ))}
            </Flex>
        </Flex>
    </Card>
)
