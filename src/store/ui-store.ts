import { create } from "zustand";

interface UiState {
  isMobileNavOpen: boolean;
  isCommandOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileNavOpen: false,
  isCommandOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setCommandOpen: (open) => set({ isCommandOpen: open }),
}));
