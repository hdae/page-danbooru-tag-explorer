import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Tags } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ListItem } from "@/components/list-item";
import type { Mode } from "@/lib/types";

const worker = new ComlinkWorker<typeof import("@/lib/search-worker")>(
  new URL("@/lib/search-worker", import.meta.url),
);

const initialQuery = new URLSearchParams(window.location.search).get("q") ?? "";

export const App = () => {
  const [search, setSearch] = useState(initialQuery);
  const [mode, setMode] = useState<Mode>("scored");
  const [replaceUnderscore, setReplaceUnderscore] = useState(true);

  const trimmed = search.trim();
  const results = useQuery({
    queryKey: ["search", trimmed, mode],
    queryFn: () => worker.search(trimmed, 20, mode),
    enabled: trimmed.length > 0,
  });

  const hasQuery = trimmed.length > 0;
  const isEmptyResult = hasQuery && !results.isFetching && results.data?.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
      <h1 className="flex items-center gap-2 text-3xl font-bold">
        <Tags className="size-7" />
        Danbooru tag explorer
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <RadioGroup
          value={mode}
          onValueChange={(v) => setMode(v as Mode)}
          className="flex flex-row gap-4"
        >
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="scored" />
            Scored search
          </Label>
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="sorted" />
            Popularity search
          </Label>
        </RadioGroup>

        <Label className="flex items-center gap-2">
          <Checkbox
            checked={replaceUnderscore}
            onCheckedChange={(v) => setReplaceUnderscore(v === true)}
          />
          Replace underscore on copy
        </Label>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tags..."
          value={search}
          onChange={(ev) => setSearch(ev.currentTarget.value)}
          className="h-10 pl-9 text-base"
        />
      </div>

      {!hasQuery && <p className="text-sm text-muted-foreground">Type a tag name to search.</p>}

      {hasQuery && results.isFetching && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Searching...
        </div>
      )}

      {isEmptyResult && (
        <p className="text-sm text-muted-foreground">No tags found for &quot;{trimmed}&quot;.</p>
      )}

      <div className="flex flex-col gap-3">
        {results.data?.map((r) => (
          <ListItem key={r.item.w} result={r} replaceUnderscore={replaceUnderscore} />
        ))}
      </div>
    </div>
  );
};
