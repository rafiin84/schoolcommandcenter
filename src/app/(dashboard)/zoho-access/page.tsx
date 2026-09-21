"use client";

import { useMemo, useState } from "react";
import { ContentContainer } from "@/components/layout/content-container";
import { PageHeader } from "@/components/layout/page-header";
import { DirectoryAccountCard } from "@/components/zoho/directory-account-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { useDirectorySchoolAccounts } from "@/hooks/use-school-directory";

const ALL = "__all__";

export default function ZohoAccessPage() {
  const [districtId, setDistrictId] = useState(ALL);
  const [blockId, setBlockId] = useState(ALL);

  const accounts = useDirectorySchoolAccounts();
  const allAccounts = accounts.data ?? [];

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
    let list = allAccounts;
    if (districtId !== ALL) list = list.filter((a) => a.districtId === districtId);
    if (blockId !== ALL) list = list.filter((a) => a.blockId === blockId);
    return list;
  }, [allAccounts, districtId, blockId]);

  return (
    <ContentContainer>
      <PageHeader
        eyebrow="Tamil Nadu · Navigation"
        title="Zoho Classes Access"
        description="A directory of mapped Zoho Classes environments, sourced from the real Tamil Nadu school directory."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">District</label>
          <Select
            value={districtId}
            onValueChange={(value) => {
              setDistrictId(value ?? ALL);
              setBlockId(ALL);
            }}
          >
            <SelectTrigger className="h-14 w-full rounded-xl border-2 border-primary/25 bg-primary/5 px-4 text-base font-medium">
              <SelectValue placeholder="All districts" />
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
          <label className="mb-1.5 block text-sm font-semibold text-foreground">Block</label>
          <Select value={blockId} onValueChange={(value) => setBlockId(value ?? ALL)}>
            <SelectTrigger className="h-14 w-full rounded-xl border-2 border-brand-accent/25 bg-brand-accent/5 px-4 text-base font-medium">
              <SelectValue placeholder="All blocks" />
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
          description="Try clearing the District/Block filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((account) => (
            <DirectoryAccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </ContentContainer>
  );
}
