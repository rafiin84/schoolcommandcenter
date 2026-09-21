import { NextResponse } from "next/server";
import { fetchCourseTemplatePage } from "@/lib/course-templates/upstream";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const search = searchParams.get("search")?.trim() || "";
  const searchToken = searchParams.get("searchToken") || "";

  try {
    const payload = await fetchCourseTemplatePage({ page, search, searchToken });
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Couldn't reach the course template service." }, { status: 502 });
  }
}
