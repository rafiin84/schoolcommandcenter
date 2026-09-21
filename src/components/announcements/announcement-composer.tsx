"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Image as ImageIcon,
  PaperPlaneTilt,
  Plus,
  Sparkle,
  VideoCamera,
  X,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { Announcement, AnnouncementAttachment, AnnouncementCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDistrictSummaries } from "@/hooks/use-map";
import { useAnnouncementStore } from "@/store/announcement-store";

const STATEWIDE = "__statewide__";
const CURRENT_USER = { name: "State Education Reviewer", role: "You", initials: "SR" };

const AI_DRAFTS: Record<AnnouncementCategory, (title: string) => string> = {
  milestone: (title) =>
    `We're excited to share a milestone: ${title || "this update"}. It reflects strong progress across the Zoho Classes rollout, and it wouldn't be possible without the schools and educators driving it forward.`,
  update: (title) =>
    `Quick update on ${title || "this item"}: sharing the latest status so districts and blocks can plan next steps accordingly. More details to follow as things progress.`,
  insight: (title) =>
    `A quick insight worth flagging on ${title || "this topic"}: the data suggests it's worth a closer look this week, particularly for districts trailing the statewide average.`,
  guidance: (title) =>
    `Some guidance on ${title || "this process"}: please review the steps below and reach out to your block education officer if anything is unclear.`,
  introduction: (title) =>
    `Introducing ${title || "a new update"} — a quick heads-up for everyone in the network so you know what's changed and where to look for it.`,
};

const composerSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(120, "Keep the title under 120 characters"),
  body: z.string().trim().min(10, "Write a bit more detail").max(2000),
  category: z.enum(["milestone", "update", "insight", "guidance", "introduction"]),
  audience: z.string(),
  youtubeUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || /youtu\.?be/.test(v), "Enter a YouTube video URL")
    .optional(),
});

type ComposerValues = z.infer<typeof composerSchema>;

function fileKind(file: File): AnnouncementAttachment["kind"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "document";
}

let localAttachmentCounter = 0;

export function AnnouncementComposer() {
  const [expanded, setExpanded] = useState(false);
  const [showYoutubeField, setShowYoutubeField] = useState(false);
  const [localFiles, setLocalFiles] = useState<{ file: File; attachment: AnnouncementAttachment }[]>([]);
  const [posted, setPosted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const districts = useDistrictSummaries();
  const addAnnouncement = useAnnouncementStore((s) => s.addAnnouncement);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ComposerValues>({
    resolver: zodResolver(composerSchema),
    defaultValues: { title: "", body: "", category: "update", audience: STATEWIDE, youtubeUrl: "" },
  });

  const category = watch("category");
  const title = watch("title");
  const body = watch("body");

  function collapse() {
    setExpanded(false);
    setShowYoutubeField(false);
    reset({ title: "", body: "", category: "update", audience: STATEWIDE, youtubeUrl: "" });
    localFiles.forEach((f) => URL.revokeObjectURL(f.attachment.url));
    setLocalFiles([]);
  }

  function handleFilesSelected(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).map((file) => {
      localAttachmentCounter += 1;
      const attachment: AnnouncementAttachment = {
        id: `local-${localAttachmentCounter}`,
        kind: fileKind(file),
        url: URL.createObjectURL(file),
        name: file.name,
      };
      return { file, attachment };
    });
    setLocalFiles((prev) => [...prev, ...next]);
  }

  function removeLocalFile(id: string) {
    setLocalFiles((prev) => {
      const match = prev.find((f) => f.attachment.id === id);
      if (match) URL.revokeObjectURL(match.attachment.url);
      return prev.filter((f) => f.attachment.id !== id);
    });
  }

  function generateWithAi() {
    setValue("body", AI_DRAFTS[category](title.trim()), { shouldValidate: true });
  }

  function onSubmit(values: ComposerValues) {
    const attachments: AnnouncementAttachment[] = [...localFiles.map((f) => f.attachment)];
    if (values.youtubeUrl) {
      attachments.push({
        id: `youtube-${Date.now()}`,
        kind: "youtube",
        url: values.youtubeUrl,
        name: "YouTube video",
      });
    }

    const districtList = districts.data?.data ?? [];
    const selectedDistrict =
      values.audience === STATEWIDE ? null : districtList.find((d) => d.id === values.audience) ?? null;

    const announcement: Announcement = {
      id: `announce-draft-${Date.now()}`,
      authorName: CURRENT_USER.name,
      authorRole: CURRENT_USER.role,
      authorInitials: CURRENT_USER.initials,
      createdAt: new Date().toISOString(),
      category: values.category,
      title: values.title,
      body: values.body,
      audienceLabel: selectedDistrict ? `${selectedDistrict.name} district` : "Statewide",
      districtId: selectedDistrict?.id ?? null,
      attachments,
    };

    addAnnouncement(announcement);
    setPosted(true);
    collapse();
    setTimeout(() => setPosted(false), 4000);
  }

  return (
    <div className="mb-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        className="hidden"
        onChange={(e) => {
          handleFilesSelected(e.target.files);
          e.target.value = "";
        }}
      />

      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex w-full items-center gap-3 text-left"
        >
          <Avatar>
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {CURRENT_USER.initials}
            </AvatarFallback>
          </Avatar>
          <span className="flex-1 rounded-full border border-border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
            Share an announcement…
          </span>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
            <ImageIcon size={18} />
          </span>
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {CURRENT_USER.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{CURRENT_USER.name}</p>
              <p className="text-xs text-muted-foreground">{CURRENT_USER.role}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Give this announcement a title…"
              className="flex-1 border-none bg-transparent px-0 text-sm font-medium shadow-none focus-visible:ring-0"
              {...register("title")}
            />
            <select
              {...register("audience")}
              disabled={districts.isLoading}
              aria-label="Audience"
              className="h-8 w-full shrink-0 rounded-lg border border-input bg-transparent px-2.5 text-xs text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 sm:w-40"
            >
              <option value={STATEWIDE}>Statewide</option>
              {(districts.data?.data ?? []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} district
                </option>
              ))}
            </select>
          </div>
          {errors.title && <p className="-mt-2 text-xs text-destructive">{errors.title.message}</p>}

          <Textarea
            placeholder="What do you want to share with schools and districts?"
            rows={4}
            className="resize-none border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
            {...register("body")}
          />
          {errors.body && <p className="-mt-2 text-xs text-destructive">{errors.body.message}</p>}

          {showYoutubeField && (
            <div>
              <Input
                placeholder="https://youtube.com/watch?v=…"
                {...register("youtubeUrl")}
                autoFocus
              />
              {errors.youtubeUrl && <p className="mt-1 text-xs text-destructive">{errors.youtubeUrl.message}</p>}
            </div>
          )}

          {localFiles.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {localFiles.map(({ attachment }) => {
                const Icon = attachment.kind === "image" ? ImageIcon : attachment.kind === "video" ? VideoCamera : FileText;
                return (
                  <li
                    key={attachment.id}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground"
                  >
                    <Icon size={13} />
                    <span className="max-w-40 truncate">{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => removeLocalFile(attachment.id)}
                      aria-label={`Remove ${attachment.name}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={12} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="rounded-lg bg-muted px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            Posted for this session only — attachments and AI drafts stay in your browser and nothing is
            uploaded to a server. Refreshing the page clears them.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      <Plus size={16} />
                      Add to your post
                    </button>
                  }
                />
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2">
                    <ImageIcon size={15} />
                    Photo or document
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowYoutubeField(true)} className="gap-2">
                    <YoutubeLogo size={15} />
                    YouTube link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                type="button"
                onClick={generateWithAi}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <Sparkle size={14} weight="fill" />
                Generate with AI
              </button>
            </div>

            <div className="flex items-center gap-3">
              {posted && <span className="text-xs font-medium text-status-good">Posted below.</span>}
              <button
                type="button"
                onClick={collapse}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <Button type="submit" disabled={isSubmitting || !body.trim()} className="gap-2">
                <PaperPlaneTilt size={15} />
                Post
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
