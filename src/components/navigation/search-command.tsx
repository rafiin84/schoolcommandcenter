"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Buildings,
  GraduationCap,
  MagnifyingGlass,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useEducationMapData } from "@/hooks/use-map";
import { useUiStore } from "@/store/ui-store";

const LEVEL_ICON = {
  district: MapPin,
  block: Buildings,
  school: GraduationCap,
  state: MapPin,
} as const;

export function SearchCommand() {
  const isOpen = useUiStore((s) => s.isCommandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { data } = useEducationMapData({});

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!isOpen);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  const results = useMemo(() => {
    if (!data?.data || query.trim().length === 0) return [];
    const q = query.toLowerCase();
    return data.data
      .filter(
        (node) =>
          node.level !== "state" &&
          (node.name.toLowerCase().includes(q) ||
            (node.schoolCode ?? "").toLowerCase().includes(q)),
      )
      .slice(0, 20);
  }, [data, query]);

  return (
    <>
      <Button
        variant="outline"
        className="h-10 w-full max-w-sm justify-start gap-2 rounded-full px-4 text-muted-foreground shadow-none"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlass size={16} />
        <span className="text-sm">Search district, block, or school…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog
        open={isOpen}
        onOpenChange={setOpen}
        title="Search"
        description="Search for a district, block, or school by name or code"
      >
        <CommandInput
          placeholder="Search district, block, school, or school code…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {query.trim().length === 0
              ? "Start typing to search the statewide directory."
              : "No matching geography found."}
          </CommandEmpty>
          <CommandGroup heading="Results">
            {results.map((node) => {
              const Icon = LEVEL_ICON[node.level];
              return (
                <CommandItem
                  key={node.id}
                  value={node.id}
                  onSelect={() => {
                    setOpen(false);
                    setQuery("");
                    router.push(`/education-map?focus=${node.id}`);
                  }}
                >
                  <Icon size={16} className="text-muted-foreground" />
                  <span>{node.name}</span>
                  <span className="ml-auto text-xs capitalize text-muted-foreground">
                    {node.level}
                    {node.schoolCode ? ` · ${node.schoolCode}` : ""}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
