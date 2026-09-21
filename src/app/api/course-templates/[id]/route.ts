import { NextResponse } from "next/server";
import { fetchCourseTemplateMedia } from "@/lib/course-templates/upstream";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const media = await fetchCourseTemplateMedia(id);
    return NextResponse.json(media);
  } catch {
    return NextResponse.json({ error: "Couldn't reach the course template service." }, { status: 502 });
  }
}
