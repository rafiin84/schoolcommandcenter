import { create } from "zustand";
import type { OnboardingStatus, Priority } from "@/types";

export interface MapFilterState {
  search: string;
  priority: Priority[];
  onboardingStatus: OnboardingStatus[];
  minEngagement: number | null;
  maxEngagement: number | null;
}

interface MapStoreState {
  selectedEntityId: string | null;
  hoveredEntityId: string | null;
  filters: MapFilterState;
  selectEntity: (id: string | null) => void;
  hoverEntity: (id: string | null) => void;
  setSearch: (search: string) => void;
  togglePriority: (priority: Priority) => void;
  toggleOnboardingStatus: (status: OnboardingStatus) => void;
  setEngagementRange: (min: number | null, max: number | null) => void;
  resetFilters: () => void;
}

const defaultFilters: MapFilterState = {
  search: "",
  priority: [],
  onboardingStatus: [],
  minEngagement: null,
  maxEngagement: null,
};

export const useMapStore = create<MapStoreState>((set) => ({
  selectedEntityId: null,
  hoveredEntityId: null,
  filters: defaultFilters,
  selectEntity: (id) => set({ selectedEntityId: id }),
  hoverEntity: (id) => set({ hoveredEntityId: id }),
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  togglePriority: (priority) =>
    set((state) => {
      const has = state.filters.priority.includes(priority);
      return {
        filters: {
          ...state.filters,
          priority: has
            ? state.filters.priority.filter((p) => p !== priority)
            : [...state.filters.priority, priority],
        },
      };
    }),
  toggleOnboardingStatus: (status) =>
    set((state) => {
      const has = state.filters.onboardingStatus.includes(status);
      return {
        filters: {
          ...state.filters,
          onboardingStatus: has
            ? state.filters.onboardingStatus.filter((s) => s !== status)
            : [...state.filters.onboardingStatus, status],
        },
      };
    }),
  setEngagementRange: (min, max) =>
    set((state) => ({ filters: { ...state.filters, minEngagement: min, maxEngagement: max } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
