"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { ContentContainer } from "@/components/layout/content-container";
import { PageHeader } from "@/components/layout/page-header";
import { DirectoryAccountCard } from "@/components/zoho/directory-account-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { useDirectorySchoolAccounts } from "@/hooks/use-school-directory";

const ALL = "__all__";

export default function ZohoAccessPage() {
  const [search, setSearch] = useState("");
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
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.schoolName.toLowerCase().includes(q) ||
          a.loginEmail.toLowerCase().includes(q) ||
          a.districtName.toLowerCase().includes(q) ||
          a.blockLabel.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allAccounts, districtId, blockId, search]);

  return (
    <ContentContainer>
      <PageHeader
        eyebrow="Tamil Nadu · Navigation"
        title="Zoho Classes Access"
        description="A directory of mapped Zoho Classes environments, sourced from the real Tamil Nadu school directory. The Command Center never collects or stores Zoho Classes passwords — sign-in always happens on the Zoho Classes login page."
      />

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-status-info/25 bg-status-info/10 p-3 text-sm text-foreground">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-status-info" />
        <p>
          Selecting &ldquo;Open Zoho Classes&rdquo; opens the mapped login destination in a new tab. You&apos;ll
          authenticate there with the account&apos;s login email and your assigned password.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by school, login email, district, or block…"
            className="pl-9"
            aria-label="Search Zoho Classes accounts"
          />
        </div>

        <Select
          value={districtId}
          onValueChange={(value) => {
            setDistrictId(value ?? ALL);
            setBlockId(ALL);
          }}
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="District" />
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

        <Select value={blockId} onValueChange={(value) => setBlockId(value ?? ALL)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Block" />
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
          description="Try a different search term, or clear the District/Block filter."
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
