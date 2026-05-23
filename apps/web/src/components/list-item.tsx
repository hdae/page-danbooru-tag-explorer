import type { FuseResult } from "fuse.js";
import { Star } from "lucide-react";
import type React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TagRow } from "@/lib/types";

type Category = {
  label: string;
  tint: string;
  badge: string;
};

const CATEGORY: Record<string, Category> = {
  "0": {
    label: "General",
    tint: "hover:bg-accent",
    badge: "text-muted-foreground",
  },
  "1": {
    label: "Artist",
    tint: "bg-red-500/10 hover:bg-red-500/20",
    badge: "border-red-500/40 text-red-300",
  },
  "3": {
    label: "Copyright",
    tint: "bg-blue-500/10 hover:bg-blue-500/20",
    badge: "border-blue-500/40 text-blue-300",
  },
  "4": {
    label: "Character",
    tint: "bg-green-500/10 hover:bg-green-500/20",
    badge: "border-green-500/40 text-green-300",
  },
  "5": {
    label: "Meta",
    tint: "bg-purple-500/10 hover:bg-purple-500/20",
    badge: "border-purple-500/40 text-purple-300",
  },
};

const FALLBACK: Category = {
  label: "Unknown",
  tint: "hover:bg-accent",
  badge: "text-muted-foreground",
};

const copy = (text: string) => {
  void navigator.clipboard
    .writeText(text)
    .then(() => toast.success(`Copied: ${text}`))
    .catch(() => toast.error("Copy failed"));
};

type Props = {
  result: FuseResult<TagRow>;
  replaceUnderscore: boolean;
};

export const ListItem = ({ result, replaceUnderscore }: Props) => {
  const { w, c, a } = result.item;
  const category = CATEGORY[c] ?? FALLBACK;
  const popularity = Number(result.item.p).toLocaleString();
  const displayed = replaceUnderscore ? w.replaceAll("_", " ") : w;
  const onClick = () => copy(displayed);
  const onKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      size="sm"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`cursor-pointer transition-colors ${category.tint}`}
    >
      <CardHeader>
        <CardTitle className="text-base font-semibold">{displayed}</CardTitle>
        <CardAction className="flex items-center gap-1.5">
          <Badge variant="secondary">
            <Star className="fill-yellow-400 text-yellow-400" />
            {popularity}
          </Badge>
          <Badge variant="outline" className={category.badge}>
            {category.label}
          </Badge>
        </CardAction>
      </CardHeader>
      {a.length > 0 && (
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {a.map((alias) => (
              <Badge key={alias} variant="outline" className="text-muted-foreground">
                {alias}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
