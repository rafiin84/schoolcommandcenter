"use client";

import { useMemo, useState } from "react";
import type { AdministrativeLevel, GeographicHierarchy, LeadershipContact } from "@/types";
import { ContentContainer } from "@/components/layout/content-container";
import { ContactCard, ContactRow } from "@/components/directory/contact-card";
import { SearchInput } from "@/components/shared/search-input";
import { ViewToggle, type ViewMode } from "@/components/shared/view-toggle";
import { Flag, GraduationCap, MapPin, SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { FilterDialog } from "@/components/shared/filter-dialog";
import { SortIcon, SortMenu, SortNameIcon } from "@/components/shared/sort-menu";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { useLeadershipDirectory } from "@/hooks/use-directory";
import { useEducationMapData } from "@/hooks/use-map";

const LEVEL_OPTIONS: AdministrativeLevel[] = ["state", "district", "block", "school"];
export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState<AdministrativeLevel[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
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
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name or title"
            ariaLabel="Search directory"
            className="w-96 max-w-full"
          />
          <div className="ml-auto flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setFilterOpen(true)}>
              Filter
              <SortIcon size={18} />
              {levels.length > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {levels.length}
                </span>
              )}
            </Button>
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
        </div>
      </div>

      <FilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        sections={[
          {
            key: "level",
            label: "Administrative level",
            options: [
              { value: "state", label: "State", icon: Flag },
              { value: "district", label: "District", icon: MapPin },
              { value: "block", label: "Block", icon: SquaresFour },
              { value: "school", label: "School", icon: GraduationCap },
            ],
          },
        ]}
        value={{ level: levels }}
        onApply={(next) => setLevels(next.level as AdministrativeLevel[])}
      />

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
