"use client";

import { useQuery } from "@tanstack/react-query";
import type { SchoolDirectoryRaw } from "@/types";
import { buildDirectorySchoolAccounts } from "@/lib/mock-data/school-directory-accounts";

async function fetchSchoolDirectoryAccounts() {
  const res = await fetch("/data/tn-school-directory.json");
  if (!res.ok) throw new Error("Failed to load the school directory dataset");
  const raw = (await res.json()) as SchoolDirectoryRaw;
  return buildDirectorySchoolAccounts(raw);
}

/** ~700 Zoho Classes accounts built from the real Tamil Nadu school directory. */
export function useDirectorySchoolAccounts() {
  return useQuery({
    queryKey: ["school-directory-accounts"],
    queryFn: fetchSchoolDirectoryAccounts,
    staleTime: Infinity,
  });
}
