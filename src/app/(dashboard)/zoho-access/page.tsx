"use client";

import { useMemo, useState } from "react";
import { ContentContainer } from "@/components/layout/content-container";
import { DirectoryAccountCard, DirectoryAccountRow } from "@/components/zoho/directory-account-card";
import { AddZohoAccountDialog } from "@/components/zoho/add-zoho-account-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortMenu, SortNameIcon, SortTimeIcon } from "@/components/shared/sort-menu";
import { SearchInput } from "@/components/shared/search-input";
import { ViewToggle, type ViewMode } from "@/components/shared/view-toggle";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { useDirectorySchoolAccounts } from "@/hooks/use-school-directory";
import { useZohoDirectoryStore } from "@/store/zoho-directory-store";

const ALL = "__all__";

export default function ZohoAccessPage() {
  const [districtId, setDistrictId] = useState(ALL);
  const [blockId, setBlockId] = useState(ALL);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<"name" | "verified">("name");

  const accounts = useDirectorySchoolAccounts();
  const draftAccounts = useZohoDirectoryStore((s) => s.draftAccounts);
  const allAccounts = useMemo(() => [...draftAccounts, ...(accounts.data ?? [])], [draftAccounts, accounts.data]);

  // Stable numbering: imported accounts first, then manually added ones.
  const accountNumbers = useMemo(() => {
    const map = new Map<string, number>();
    [...(accounts.data ?? []), ...draftAccounts].forEach((a, i) => map.set(a.id, i + 1));
    return map;
  }, [accounts.data, draftAccounts]);

  const districts = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of allAccounts) seen.set(a.districtId, a.districtName);
    return [...seen.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allAccounts]);

  const blocks = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of allAccounts) {
      if (districtId !== ALL && a.districtId !== districtId) continue;
      seen.set(a.blockId, a.blockLabel);
    }
    return [...seen.entries()]
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
  }, [allAccounts, districtId]);

  const filtered = useMemo(() => {
    let list = [...allAccounts];
    if (districtId !== ALL) list = list.filter((a) => a.districtId === districtId);
    if (blockId !== ALL) list = list.filter((a) => a.blockId === blockId);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.schoolName.toLowerCase().includes(q) ||
          a.loginEmail.toLowerCase().includes(q) ||
          a.blockLabel.toLowerCase().includes(q),
      );
    }
    return sortBy === "name"
      ? list.sort((a, b) => a.schoolName.localeCompare(b.schoolName))
      : list.sort((a, b) => new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime());
  }, [allAccounts, districtId, blockId, sortBy, search]);

  return (
    <ContentContainer>
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-2 block text-base font-semibold text-foreground">District</label>
          <Select
            value={districtId}
            onValueChange={(value) => {
              setDistrictId(value ?? ALL);
              setBlockId(ALL);
            }}
          >
            <SelectTrigger className="h-11 w-64 rounded-xl border border-border bg-card px-4 text-base">
              <SelectValue placeholder="All districts">{districtId === ALL ? "All districts" : districts.find((d) => d.id === districtId)?.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All districts</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-base font-semibold text-foreground">Block</label>
          <Select value={blockId} onValueChange={(value) => setBlockId(value ?? ALL)}>
            <SelectTrigger className="h-11 w-64 rounded-xl border border-border bg-card px-4 text-base">
              <SelectValue placeholder="All blocks">{blockId === ALL ? "All blocks" : blocks.find((b) => b.id === blockId)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All blocks</SelectItem>
              {blocks.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search"
            ariaLabel="Search accounts"
            className="w-64"
          />
          <ViewToggle value={view} onChange={setView} />
          <SortMenu
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "name", label: "Name", icon: SortNameIcon },
              { value: "verified", label: "Last verified", icon: SortTimeIcon },
            ]}
          />
          <AddZohoAccountDialog allAccounts={allAccounts} />
        </div>
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        {accounts.isLoading ? "Loading accounts…" : `${filtered.length} of ${allAccounts.length} accounts`}
      </p>

      {accounts.isLoading ? (
        <ListSkeleton count={6} />
      ) : accounts.isError ? (
        <ErrorState onRetry={() => accounts.refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching accounts"
          description="Try a different search or clear the District/Block filter."
        />
      ) : (
        <div className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-2"}>
          {filtered.map((account) =>
            view === "grid" ? (
              <DirectoryAccountCard key={account.id} account={account} number={accountNumbers.get(account.id) ?? 0} />
            ) : (
              <DirectoryAccountRow key={account.id} account={account} number={accountNumbers.get(account.id) ?? 0} />
            ),
          )}
        </div>
      )}
    </ContentContainer>
  );
}
