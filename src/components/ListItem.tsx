import { Badge, Card, Flex, Text } from "@radix-ui/themes"
import type { FuseResult } from "fuse.js"
import { type FC } from "react"
import toast from "react-hot-toast"

const copyToClipboard = (text: string) => () => {
    toast.promise(
        () => navigator.clipboard.writeText(text),
        {
            loading: "Copying...",
            success: `Copied: "${text}"`,
            error: "Copy failed",
        },
        {
            duration: 3000,
        }
    )
}

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
            cursor: "pointer",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            "--card-background-color": category_bg_color[result.item.c],
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
                    {category[result.item.c]} - {result.item.p}
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
