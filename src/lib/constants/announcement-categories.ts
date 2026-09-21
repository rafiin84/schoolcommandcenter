import type { AnnouncementCategory } from "@/types";

export const ANNOUNCEMENT_CATEGORIES: { id: AnnouncementCategory; label: string; emoji: string }[] = [
  { id: "milestone", label: "Milestone", emoji: "🏆" },
  { id: "update", label: "Update", emoji: "📢" },
  { id: "insight", label: "Insight", emoji: "💡" },
  { id: "guidance", label: "Guidance", emoji: "💬" },
  { id: "introduction", label: "Introduction", emoji: "🤝" },
];

export const ANNOUNCEMENT_CATEGORY_LABEL: Record<AnnouncementCategory, string> = {
  milestone: "Milestone",
  update: "Update",
  insight: "Insight",
  guidance: "Guidance",
  introduction: "Introduction",
};

export const ANNOUNCEMENT_CATEGORY_BADGE_CLASS: Record<AnnouncementCategory, string> = {
  milestone: "bg-status-good/10 text-status-good",
  update: "bg-status-info/10 text-status-info",
  insight: "bg-brand-accent/10 text-brand-accent",
  guidance: "bg-status-warning/10 text-status-warning",
  introduction: "bg-primary/10 text-primary",
};

export const ANNOUNCEMENT_CATEGORY_CARD_ACCENT: Record<AnnouncementCategory, string> = {
  milestone: "bg-status-good/5",
  update: "bg-status-info/5",
  insight: "bg-brand-accent/5",
  guidance: "bg-status-warning/6",
  introduction: "bg-primary/5",
};
