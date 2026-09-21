import { create } from "zustand";
import type { Announcement } from "@/types";

interface AnnouncementStoreState {
  /** Session-only: announcements composed in this browser tab, newest first. Never persisted. */
  draftAnnouncements: Announcement[];
  /** Ids hidden from the feed this session — covers both drafts and seeded mock announcements. */
  dismissedIds: string[];
  addAnnouncement: (announcement: Announcement) => void;
  dismissAnnouncement: (id: string) => void;
  clearAll: (visibleIds: string[]) => void;
}

export const useAnnouncementStore = create<AnnouncementStoreState>((set) => ({
  draftAnnouncements: [],
  dismissedIds: [],
  addAnnouncement: (announcement) =>
    set((state) => ({ draftAnnouncements: [announcement, ...state.draftAnnouncements] })),
  dismissAnnouncement: (id) =>
    set((state) => ({ dismissedIds: [...state.dismissedIds, id] })),
  clearAll: (visibleIds) =>
    set((state) => ({ dismissedIds: [...state.dismissedIds, ...visibleIds] })),
}));
