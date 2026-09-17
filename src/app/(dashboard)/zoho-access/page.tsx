"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { ContentContainer } from "@/components/layout/content-container";
import { PageHeader } from "@/components/layout/page-header";
import { ZohoAccountCard } from "@/components/zoho/zoho-account-card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { useZohoAccountDirectory } from "@/hooks/use-zoho";
import { useEducationMapData } from "@/hooks/use-map";
import type { GeographicHierarchy } from "@/types";

export default function ZohoAccessPage() {
  const [search, setSearch] = useState("");
  const accounts = useZohoAccountDirectory();
  const allNodes = useEducationMapData({});

  const nodesById = useMemo(() => {
    const map = new Map<string, GeographicHierarchy>();
    for (const node of allNodes.data?.data ?? []) map.set(node.id, node);
    return map;
  }, [allNodes.data]);

  const enriched = useMemo(() => {
    return (accounts.data?.data ?? []).map((account) => {
      const school = nodesById.get(account.assignedSchoolId);
      const district = school?.districtId ? nodesById.get(school.districtId) : undefined;
      const block = school?.blockId ? nodesById.get(school.blockId) : undefined;
      return {
        account,
        schoolName: school?.name ?? "Unknown school",
        districtName: district?.name,
        blockName: block?.name,
      };
    });
  }, [accounts.data, nodesById]);

  const filtered = useMemo(() => {
    if (!search.trim()) return enriched;
    const q = search.toLowerCase();
    return enriched.filter(
      (item) =>
        item.schoolName.toLowerCase().includes(q) ||
        item.account.accountReference.toLowerCase().includes(q) ||
        (item.districtName ?? "").toLowerCase().includes(q) ||
        (item.blockName ?? "").toLowerCase().includes(q),
    );
  }, [enriched, search]);

  return (
    <ContentContainer>
      <PageHeader
        eyebrow="Tamil Nadu · Navigation"
        title="Zoho Classes Access"
        description="A directory of mapped Zoho Classes environments. The Command Center never collects or stores Zoho Classes passwords — sign-in always happens on the Zoho Classes login page."
      />

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-status-info/25 bg-status-info/10 p-3 text-sm text-foreground">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-status-info" />
        <p>
          Selecting &ldquo;Open Zoho Classes&rdquo; opens the mapped login destination in a new tab. You&apos;ll
          authenticate there with your assigned email and password.
        </p>
      </div>

      <div className="relative mb-6">
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by school, account reference, district, or block…"
          className="pl-9"
          aria-label="Search Zoho Classes accounts"
        />
      </div>

      {accounts.isLoading ? (
        <ListSkeleton count={6} />
      ) : accounts.isError ? (
        <ErrorState onRetry={() => accounts.refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching accounts"
          description="Try a different school name, account reference, district, or block."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ account, schoolName, districtName, blockName }) => (
            <ZohoAccountCard
              key={account.id}
              account={account}
              schoolName={schoolName}
              districtName={districtName}
              blockName={blockName}
            />
          ))}
        </div>
      )}
    </ContentContainer>
  );
}
