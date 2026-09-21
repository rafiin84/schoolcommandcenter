import { useQuery } from "@tanstack/react-query";
import type { CourseTemplateMedia } from "@/types";

async function fetchMedia(id: string): Promise<CourseTemplateMedia> {
  const res = await fetch(`/api/course-templates/${id}`);
  if (!res.ok) throw new Error("Couldn't load template media.");
  return res.json();
}

export function useCourseTemplateMedia(id: string) {
  return useQuery({
    queryKey: ["course-template-media", id],
    queryFn: () => fetchMedia(id),
    staleTime: Infinity,
  });
}
