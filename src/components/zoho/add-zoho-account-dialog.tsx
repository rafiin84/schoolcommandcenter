"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "@phosphor-icons/react/dist/ssr";
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
  const [open, setOpen] = useState(false);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Zoho Classes account</DialogTitle>
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
      </DialogContent>
    </Dialog>
  );
}
