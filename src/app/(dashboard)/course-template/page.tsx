import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { ContentContainer } from "@/components/layout/content-container";
import { Button } from "@/components/ui/button";

const TEMPLATE_GALLERY_URL = "https://templates.onslate.in/";

export default function CourseTemplatePage() {
  return (
    <ContentContainer className="flex h-[calc(100svh-10rem)] min-h-[32rem] flex-col pt-3 sm:pt-4 md:h-[calc(100svh-6.5rem)] lg:pt-4">
      <div className="mb-4 flex items-center justify-end">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          nativeButton={false}
          render={<a href={TEMPLATE_GALLERY_URL} target="_blank" rel="noopener noreferrer" />}
        >
          Open full gallery
          <ArrowSquareOut size={14} />
        </Button>
      </div>

      <iframe
        src={TEMPLATE_GALLERY_URL}
        title="Course template gallery"
        className="w-full flex-1 rounded-lg border border-border bg-card"
        allow="fullscreen; clipboard-write; autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </ContentContainer>
  );
}
