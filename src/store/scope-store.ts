import { create } from "zustand";
import type { GeographyLevel } from "@/types";

export interface ScopeState {
  level: GeographyLevel;
  districtId: string | null;
  blockId: string | null;
  schoolId: string | null;
  setStateScope: () => void;
  setDistrictScope: (districtId: string) => void;
  setBlockScope: (districtId: string, blockId: string) => void;
  setSchoolScope: (districtId: string, blockId: string, schoolId: string) => void;
}

export const useScopeStore = create<ScopeState>((set) => ({
  level: "state",
  districtId: null,
  blockId: null,
  schoolId: null,
  setStateScope: () =>
    set({ level: "state", districtId: null, blockId: null, schoolId: null }),
  setDistrictScope: (districtId) =>
    set({ level: "district", districtId, blockId: null, schoolId: null }),
  setBlockScope: (districtId, blockId) =>
    set({ level: "block", districtId, blockId, schoolId: null }),
  setSchoolScope: (districtId, blockId, schoolId) =>
    set({ level: "school", districtId, blockId, schoolId }),
}));
