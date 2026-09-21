import { useInfiniteQuery } from "@tanstack/react-query";
import type { CourseTemplatePage } from "@/types";

interface PageParam {
  page: number;
  searchToken: string;
}

async function fetchCourseTemplates(search: string, { page, searchToken }: PageParam): Promise<CourseTemplatePage> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) {
    params.set("search", search);
    if (searchToken) params.set("searchToken", searchToken);
  }
  const res = await fetch(`/api/course-templates?${params.toString()}`);
  if (!res.ok) throw new Error("Couldn't reach the course template service.");
  return res.json();
}

export function useCourseTemplates(search: string) {
  return useInfiniteQuery({
    queryKey: ["course-templates", search],
    queryFn: ({ pageParam }) => fetchCourseTemplates(search, pageParam),
    initialPageParam: { page: 1, searchToken: "" } as PageParam,
    getNextPageParam: (lastPage, _pages, lastParam): PageParam | undefined =>
      lastPage.hasMore ? { page: lastParam.page + 1, searchToken: lastPage.nextToken ?? "" } : undefined,
    staleTime: 60_000,
  });
}
