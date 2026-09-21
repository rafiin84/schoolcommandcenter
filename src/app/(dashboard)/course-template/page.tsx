"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowSquareOut, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ContentContainer } from "@/components/layout/content-container";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TemplateCard } from "@/components/course-template/template-card";
import { useCourseTemplates } from "@/hooks/use-course-templates";
import { formatNumber } from "@/lib/formatters";

const TEMPLATE_GALLERY_URL = "https://templates.onslate.in/";

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-4">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
}

export default function CourseTemplatePage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const query = useCourseTemplates(search);
  const items = useMemo(() => query.data?.pages.flatMap((p) => p.items) ?? [], [query.data]);
  const totalRecords = query.data?.pages[0]?.totalRecords ?? 0;

  return (
    <ContentContainer>
      <PageHeader
        eyebrow="Zoho Classes"
        title="Course Template"
        description="Browse Zoho Classes course templates without leaving the Command Center."
        actions={
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
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(searchInput.trim());
        }}
        className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 via-violet-50 to-purple-50 px-6 py-10 text-center sm:px-10"
      >
        <span className="absolute -top-10 -right-10 size-40 rounded-full bg-white/40" />
        <span className="absolute -bottom-12 -left-8 size-32 rounded-full bg-violet-200/50" />

        <h2 className="relative text-2xl font-bold text-foreground sm:text-3xl">
          {totalRecords > 0
            ? `Over ${formatNumber(totalRecords)} course templates to choose from!`
            : "Browse Zoho Classes course templates"}
        </h2>

        <div className="relative mx-auto mt-5 flex max-w-xl gap-2">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search course templates…"
              className="border-none bg-white pl-9 shadow-sm"
              aria-label="Search course templates"
            />
          </div>
          <Button type="submit">Search</Button>
        </div>
      </form>

      <p className="mb-4 text-sm text-muted-foreground">
        {search ? (
          <>
            Results for <span className="font-semibold text-foreground">&ldquo;{search}&rdquo;</span>
          </>
        ) : (
          <span className="font-semibold text-foreground">Recently added courses</span>
        )}
      </p>

      {query.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : query.isError ? (
        <ErrorState
          title="Couldn't load course templates"
          description="The template service didn't respond. You can still browse the full gallery in a new tab."
          onRetry={() => query.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No matching templates"
          description="Try a different search term, or browse the full gallery in a new tab."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
          {query.hasNextPage && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
              >
                {query.isFetchingNextPage ? "Loading…" : "Load more"}
              </Button>
            </div>
          )}
        </>
      )}
    </ContentContainer>
  );
}
