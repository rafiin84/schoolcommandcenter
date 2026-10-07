"use client";

import { useMemo, useState } from "react";
import type { AdministrativeLevel, GeographicHierarchy, LeadershipContact } from "@/types";
import { ContentContainer } from "@/components/layout/content-container";
import { ContactCard, ContactRow } from "@/components/directory/contact-card";
import { SearchInput } from "@/components/shared/search-input";
import { ViewToggle, type ViewMode } from "@/components/shared/view-toggle";
import { SortMenu, SortNameIcon } from "@/components/shared/sort-menu";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { useLeadershipDirectory } from "@/hooks/use-directory";
import { useEducationMapData } from "@/hooks/use-map";
import { cn } from "@/lib/utils";

const LEVEL_OPTIONS: AdministrativeLevel[] = ["state", "district", "block", "school"];
const LEVEL_LABEL: Record<AdministrativeLevel, string> = {
  state: "State",
  district: "District",
  block: "Block",
  school: "School",
};

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState<AdministrativeLevel[]>([]);
  const [view, setView] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<"name" | "level">("level");

  const directory = useLeadershipDirectory({});
  const allNodes = useEducationMapData({});

  const nodesById = useMemo(() => {
    const map = new Map<string, GeographicHierarchy>();
    for (const node of allNodes.data?.data ?? []) map.set(node.id, node);
    return map;
  }, [allNodes.data]);

  function geographyLabelFor(contact: LeadershipContact) {
    if (contact.administrativeLevel === "state") return "Tamil Nadu (statewide)";
    if (contact.schoolId) return nodesById.get(contact.schoolId)?.name ?? "Unknown school";
    if (contact.blockId) return nodesById.get(contact.blockId)?.name ?? "Unknown block";
    if (contact.districtId) return nodesById.get(contact.districtId)?.name ?? "Unknown district";
    return "Tamil Nadu";
  }

  const filtered = useMemo(() => {
    let contacts = directory.data?.data ?? [];
    if (levels.length > 0) contacts = contacts.filter((c) => levels.includes(c.administrativeLevel));
    if (search.trim()) {
      const q = search.toLowerCase();
      contacts = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.responsibility.toLowerCase().includes(q),
      );
    }
    return [...contacts].sort((a, b) =>
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : LEVEL_OPTIONS.indexOf(a.administrativeLevel) - LEVEL_OPTIONS.indexOf(b.administrativeLevel),
    );
  }, [directory.data, levels, search, sortBy]);

  return (
    <ContentContainer>
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, title, or responsibility"
          ariaLabel="Search directory"
        />
        <ViewToggle value={view} onChange={setView} />
        <SortMenu
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: "level", label: "Administrative level" },
            { value: "name", label: "Name", icon: SortNameIcon },
          ]}
        />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LEVEL_OPTIONS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() =>
                setLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
              }
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                levels.includes(level)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={levels.includes(level)}
            >
              {LEVEL_LABEL[level]}
            </button>
          ))}
        </div>
      </div>

      {directory.isLoading ? (
        <ListSkeleton count={6} />
      ) : directory.isError ? (
        <ErrorState onRetry={() => directory.refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching contacts"
          description="Try a different search term or clear the administrative level filter."
        />
      ) : (
        <div className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-2"}>
          {filtered.map((contact) =>
            view === "grid" ? (
              <ContactCard key={contact.id} contact={contact} geographyLabel={geographyLabelFor(contact)} />
            ) : (
              <ContactRow key={contact.id} contact={contact} geographyLabel={geographyLabelFor(contact)} />
            ),
          )}
        </div>
      )}
    </ContentContainer>
  );
}
