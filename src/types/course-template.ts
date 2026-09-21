export type CourseTemplateContentType = "youtube" | "video" | "pdf" | "text" | "exam" | "mixed";

export interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  language: string | null;
  country: string | null;
  modifiedAt: string | null;
  contentType: CourseTemplateContentType;
  chapterCount: number;
  itemCount: number;
  thumbnailUrl: string | null;
  sourceUrl: string | null;
  embedUrl: string | null;
}

export interface CourseTemplatePage {
  items: CourseTemplate[];
  nextToken: string | null;
  hasMore: boolean;
  totalRecords: number;
}

export interface CourseTemplateMedia {
  thumbnailUrl: string | null;
  sourceUrl: string | null;
  embedUrl: string | null;
}
