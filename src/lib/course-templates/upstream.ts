import type { CourseTemplate, CourseTemplateContentType, CourseTemplateMedia, CourseTemplatePage } from "@/types";

const UPSTREAM_BASE = "https://templates.zohoclassestest.com/api/getCourse";
const PER_PAGE = 20;
const FETCH_TIMEOUT_MS = 8000;

interface RawCourse {
  ROWID: string;
  Title: string | null;
  Description: string | null;
  Language: string | null;
  Country: string | null;
  MODIFIEDTIME: string | null;
  YoutubeCount: string | null;
  VideosCount: string | null;
  PDFCount: string | null;
  TextCount: string | null;
  ExamsCount: string | null;
  ChaptersCount: string | null;
}

interface RawChapterItem {
  FilePath: string | null;
  ThumbnailPath: string | null;
  Type: string | null;
}

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

function deriveContentType(raw: RawCourse): { contentType: CourseTemplateContentType; itemCount: number } {
  const counts: Record<string, number> = {
    youtube: Number(raw.YoutubeCount) || 0,
    video: Number(raw.VideosCount) || 0,
    pdf: Number(raw.PDFCount) || 0,
    text: Number(raw.TextCount) || 0,
    exam: Number(raw.ExamsCount) || 0,
  };
  const active = Object.entries(counts).filter(([, count]) => count > 0);
  const itemCount = active.reduce((sum, [, count]) => sum + count, 0) || 1;
  if (active.length === 1) return { contentType: active[0][0] as CourseTemplateContentType, itemCount };
  if (active.length > 1) return { contentType: "mixed", itemCount };
  return { contentType: "youtube", itemCount };
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

function mapCourse(raw: RawCourse): CourseTemplate {
  const { contentType, itemCount } = deriveContentType(raw);
  return {
    id: raw.ROWID,
    title: raw.Title?.trim() || "Untitled course template",
    description: raw.Description?.trim() || "",
    language: raw.Language ?? null,
    country: raw.Country ?? null,
    modifiedAt: raw.MODIFIEDTIME ? raw.MODIFIEDTIME.replace(" ", "T").split(":").slice(0, 3).join(":") : null,
    contentType,
    chapterCount: Number(raw.ChaptersCount) || 1,
    itemCount,
    thumbnailUrl: null,
    sourceUrl: null,
    embedUrl: null,
  };
}

export async function fetchCourseTemplatePage(params: {
  page: number;
  search: string;
  searchToken: string;
}): Promise<CourseTemplatePage> {
  const upstreamParams = new URLSearchParams({ page: String(params.page), per_page: String(PER_PAGE) });
  if (params.search) {
    upstreamParams.set("search", params.search);
    if (params.searchToken) upstreamParams.set("search_token", params.searchToken);
  }

  const raw = (await fetchJson(`${UPSTREAM_BASE}?${upstreamParams.toString()}`)) as {
    data: RawCourse[];
    TotalRecords: number | null;
    next_token: string | null;
    moreRecords: boolean;
  };

  return {
    items: raw.data.map(mapCourse),
    nextToken: raw.next_token ?? null,
    hasMore: Boolean(raw.moreRecords),
    totalRecords: raw.TotalRecords ?? 0,
  };
}

export async function fetchCourseTemplateMedia(id: string): Promise<CourseTemplateMedia> {
  const detail = (await fetchJson(`${UPSTREAM_BASE}?id=${encodeURIComponent(id)}`)) as {
    data?: { CourseChapter?: { CourseChapterItems?: RawChapterItem[] }[] };
  };
  const item = detail.data?.CourseChapter?.[0]?.CourseChapterItems?.[0];
  if (!item) return { thumbnailUrl: null, sourceUrl: null, embedUrl: null };

  const sourceUrl = item.FilePath ?? null;
  const isYouTube = item.Type === "YOUTUBE" && !!sourceUrl;
  const youTubeId = isYouTube ? extractYouTubeId(sourceUrl!) : null;

  return {
    thumbnailUrl: item.ThumbnailPath ?? null,
    sourceUrl,
    embedUrl: youTubeId ? `https://www.youtube.com/embed/${youTubeId}` : null,
  };
}
