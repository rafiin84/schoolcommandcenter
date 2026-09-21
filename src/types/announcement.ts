export type AnnouncementAttachmentKind = "image" | "video" | "youtube" | "document" | "link";

export type AnnouncementCategory = "milestone" | "update" | "insight" | "guidance" | "introduction";

export interface AnnouncementAttachment {
  id: string;
  kind: AnnouncementAttachmentKind;
  url: string;
  name: string;
}

export interface Announcement {
  id: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  createdAt: string;
  category: AnnouncementCategory;
  title: string;
  body: string;
  audienceLabel: string;
  districtId: string | null;
  attachments: AnnouncementAttachment[];
}
