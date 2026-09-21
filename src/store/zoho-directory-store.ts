import { create } from "zustand";
import type { DirectorySchoolAccount } from "@/types";

interface ZohoDirectoryStoreState {
  /** Session-only: accounts added via the "Add Zoho Classes Account" form. Never persisted. */
  draftAccounts: DirectorySchoolAccount[];
  addAccount: (account: DirectorySchoolAccount) => void;
}

export const useZohoDirectoryStore = create<ZohoDirectoryStoreState>((set) => ({
  draftAccounts: [],
  addAccount: (account) => set((state) => ({ draftAccounts: [account, ...state.draftAccounts] })),
}));
