"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Buildings, DownloadSimple, Plus, UploadSimple, UserPlus } from "@phosphor-icons/react/dist/ssr";
import type { DirectorySchoolAccount } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockInsightDisclaimer } from "@/components/ai/mock-insight-disclaimer";
import { useZohoDirectoryStore } from "@/store/zoho-directory-store";

const addAccountSchema = z.object({
  districtId: z.string().min(1, "Select a district"),
  blockId: z.string().min(1, "Select a block"),
  token: z.string().trim().min(6, "Enter a valid access token (at least 6 characters)"),
});

type AddAccountValues = z.infer<typeof addAccountSchema>;

let manualAccountCounter = 0;

export function AddZohoAccountDialog({ allAccounts }: { allAccounts: DirectorySchoolAccount[] }) {
  const [open, setOpenState] = useState(false);
  const [step, setStep] = useState<"choose" | "create">("choose");
  const fileInput = useRef<HTMLInputElement>(null);

  function setOpen(next: boolean) {
    setOpenState(next);
    if (!next) setStep("choose");
  }

  function downloadSample() {
    const csv = "District,Block,Access Token\nChennai,Block 1,paste-token-here\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "zoho-classes-accounts-sample.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function onImportPicked(file: File | undefined) {
    if (!file) return;
    toast.success("Import simulated", {
      description: `${file.name} would be validated and imported in a connected environment.`,
    });
    setOpen(false);
  }
  const addAccount = useZohoDirectoryStore((s) => s.addAccount);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddAccountValues>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: { districtId: "", blockId: "", token: "" },
  });

  const districtId = watch("districtId");

  const districts = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of allAccounts) seen.set(a.districtId, a.districtName);
    return [...seen.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [allAccounts]);

  const blocks = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of allAccounts) {
      if (!districtId || a.districtId !== districtId) continue;
      seen.set(a.blockId, a.blockLabel);
    }
    return [...seen.entries()]
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
  }, [allAccounts, districtId]);

  function onSubmit(values: AddAccountValues) {
    const district = districts.find((d) => d.id === values.districtId);
    const block = blocks.find((b) => b.id === values.blockId);
    if (!district || !block) return;

    manualAccountCounter += 1;
    const account: DirectorySchoolAccount = {
      id: `manual-${Date.now()}-${manualAccountCounter}`,
      schoolName: `Manually added account — ${block.label}`,
      districtId: district.id,
      districtName: district.name,
      blockId: block.id,
      blockLabel: block.label,
      loginEmail: `manual-account-${manualAccountCounter}@web.zohoclasses.in`,
      loginUrl: "https://web.zohoclasses.in/login/",
      environmentLabel: "Zoho Classes — Manually added",
      status: "pending",
      lastVerifiedAt: new Date().toISOString(),
      region: "Tamil Nadu",
      mockAccessState: "simulated_redirect",
      accessTokenLast4: values.token.trim().slice(-4),
    };

    addAccount(account);
    reset({ districtId: "", blockId: "", token: "" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="h-11 gap-2 px-5 text-base">
            <Plus size={17} />
            Add Zoho Classes Account
          </Button>
        }
      />
      <DialogContent className={step === "choose" ? "gap-0 p-0 sm:max-w-2xl" : "sm:max-w-md"}>
        {step === "choose" ? (
          <div className="flex flex-col items-center px-6 pt-10 pb-6 sm:px-10">
            <DialogHeader className="items-center text-center">
              <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-accent text-primary">
                <Buildings size={30} weight="fill" />
              </span>
              <DialogTitle className="text-lg font-semibold">Add or import Zoho Classes accounts.</DialogTitle>
              <DialogDescription className="sr-only">Create one account or import many at once.</DialogDescription>
            </DialogHeader>

            <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { key: "create", icon: UserPlus, title: "Create Account", text: "Link accounts manually, one at a time", onClick: () => setStep("create") },
                { key: "import", icon: UploadSimple, title: "Import Accounts", text: "Efficiently add multiple accounts at once", onClick: () => fileInput.current?.click() },
              ].map(({ key, icon: Icon, title, text, onClick }) => (
                <button
                  key={key}
                  type="button"
                  onClick={onClick}
                  className="group flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-5 text-left transition-colors hover:border-primary hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon size={22} className="text-muted-foreground/50 transition-colors group-hover:text-primary" />
                  <span className="mt-2 text-sm font-medium text-foreground">{title}</span>
                  <span className="text-sm text-muted-foreground">{text}</span>
                </button>
              ))}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={(e) => onImportPicked(e.target.files?.[0])}
            />

            <button
              type="button"
              onClick={downloadSample}
              className="mt-8 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <DownloadSimple size={18} />
              Download Sample Excel
            </button>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <span className="text-destructive">*</span> District, Block and Access token are mandatory fields for importing account data.
            </p>
          </div>
        ) : (
        <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <button type="button" onClick={() => setStep("choose")} aria-label="Back" className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-primary">
              <ArrowLeft size={16} />
            </button>
            Create Zoho Classes account
          </DialogTitle>
          <DialogDescription>
            Link a Zoho Classes account to a district and block by entering its access token.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="add-account-district" className="mb-1.5 block">
              District
            </Label>
            <Select
              value={districtId}
              onValueChange={(value) => {
                setValue("districtId", value ?? "", { shouldValidate: true });
                setValue("blockId", "", { shouldValidate: true });
              }}
            >
              <SelectTrigger id="add-account-district" className="w-full">
                <SelectValue placeholder="Select a district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.districtId && <p className="mt-1 text-xs text-destructive">{errors.districtId.message}</p>}
          </div>

          <div>
            <Label htmlFor="add-account-block" className="mb-1.5 block">
              Block
            </Label>
            <Select
              value={watch("blockId")}
              onValueChange={(value) => setValue("blockId", value ?? "", { shouldValidate: true })}
            >
              <SelectTrigger id="add-account-block" className="w-full" disabled={!districtId}>
                <SelectValue placeholder={districtId ? "Select a block" : "Select a district first"} />
              </SelectTrigger>
              <SelectContent>
                {blocks.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.blockId && <p className="mt-1 text-xs text-destructive">{errors.blockId.message}</p>}
          </div>

          <div>
            <Label htmlFor="add-account-token" className="mb-1.5 block">
              Access token
            </Label>
            <Input
              id="add-account-token"
              type="password"
              autoComplete="off"
              placeholder="Paste the Zoho Classes access token…"
              {...register("token")}
            />
            {errors.token && <p className="mt-1 text-xs text-destructive">{errors.token.message}</p>}
          </div>

          <MockInsightDisclaimer text="Added for this session only — the token is not stored or sent anywhere, and nothing is saved to a server." />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Add account
            </Button>
          </DialogFooter>
        </form>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
}
