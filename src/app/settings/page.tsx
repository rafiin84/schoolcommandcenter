"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  MagnifyingGlass,
  Sparkle,
  Trash,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AiModel {
  id: string;
  name: string;
  provider: string;
  note: string;
  keyUrl: string;
}

const MODELS: AiModel[] = [
  {
    id: "gpt-5-6-luna",
    name: "GPT-5.6 Luna",
    provider: "OpenAI",
    note: "Cost-optimized GPT-5.6 model. Designed for high-volume, cost-sensitive workloads.",
    keyUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "gemini-3-7-flash",
    name: "Gemini 3.7 Flash",
    provider: "Google",
    note: "Fast, lightweight Gemini model. Designed for low-latency responses.",
    keyUrl: "https://aistudio.google.com/app/apikey",
  },
];

const STORAGE_KEY = "scc-ai-assistant-settings";

interface Saved {
  modelId: string;
  apiKeys: Record<string, string>;
  faculties: boolean;
  students: boolean;
  games: boolean;
}

const DEFAULTS: Saved = { modelId: MODELS[0].id, apiKeys: {}, faculties: true, students: true, games: true };

function AudienceChip({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        checked
          ? "border-status-good/40 bg-status-good/10 text-status-good"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {checked && <Check size={14} weight="bold" />}
      {label}
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [state, setState] = useState<Saved>(DEFAULTS);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* storage unavailable — fall back to defaults */
    }
  }, []);

  const model = MODELS.find((m) => m.id === state.modelId) ?? MODELS[0];
  const apiKey = state.apiKeys[model.id] ?? "";
  const visibleModels = MODELS.filter((m) =>
    `${m.name} ${m.provider}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const update = (patch: Partial<Saved>) => {
    setSaved(false);
    setState((s) => ({ ...s, ...patch }));
  };
  const setKey = (value: string) => update({ apiKeys: { ...state.apiKeys, [model.id]: value } });

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    setSaved(true);
  };

  const close = () => (window.history.length > 1 ? router.back() : router.push("/overview"));

  return (
    <div className="min-h-screen bg-card">
      <header className="flex h-14 items-center justify-between border-b border-border px-6 lg:px-[12.5%]">
        <h1 className="text-base font-medium text-foreground">Settings</h1>
        <button type="button" onClick={close} aria-label="Close settings" className="text-foreground/80 hover:text-foreground">
          <XCircle size={26} />
        </button>
      </header>

      <div className="mx-auto flex max-w-[1440px] flex-col md:flex-row">
        <aside className="shrink-0 border-b border-border p-4 md:w-[31%] md:border-b-0 md:border-r md:p-0 md:pl-[8%] md:pr-4 md:pt-8">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg bg-primary/10 px-4 py-3 text-left text-[15px] font-medium text-primary"
            aria-current="page"
          >
            <Sparkle size={18} />
            AI Assistant
          </button>
        </aside>

        <main className="min-h-[calc(100vh-56px)] flex-1 px-6 py-8 md:px-7 lg:pr-[10%]">
          <h2 className="mb-8 text-xl font-semibold text-foreground">AI Assistant Configuration</h2>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[15px] font-medium text-foreground">AI Model</h3>
            <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-border px-3 sm:w-[200px]">
              <MagnifyingGlass size={16} className="text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search models..."
                aria-label="Search models"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-3">
            {visibleModels.map((m) => {
              const active = m.id === model.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => update({ modelId: m.id })}
                  aria-pressed={active}
                  className={cn(
                    "flex w-[200px] flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors",
                    active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                  )}
                >
                  <Sparkle size={22} weight="fill" className={active ? "text-primary" : "text-muted-foreground"} />
                  <span className={cn("mt-2 text-[15px] font-medium", active ? "text-primary" : "text-foreground")}>
                    {m.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{m.provider}</span>
                </button>
              );
            })}
            {visibleModels.length === 0 && <p className="text-sm text-muted-foreground">No models match your search.</p>}
          </div>

          <p className="mb-8 rounded-lg bg-muted px-5 py-4 text-sm text-foreground">
            <strong className="font-semibold">Note:</strong> {model.note}
          </p>

          <label htmlFor="api-key" className="mb-2 block text-[15px] font-medium text-foreground">
            API Key
          </label>
          <div className="mb-8 flex items-center gap-2">
            <input
              id="api-key"
              type="password"
              autoComplete="off"
              value={apiKey}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Paste your API key"
              className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Clear API key"
              disabled={!apiKey}
              onClick={() => setKey("")}
              className="size-11 shrink-0 text-status-critical"
            >
              <Trash size={16} weight="fill" />
            </Button>
          </div>

          <p className="mb-8 text-sm text-muted-foreground">
            Go to{" "}
            <a href={model.keyUrl} target="_blank" rel="noreferrer" className="text-primary underline">
              {model.keyUrl}
            </a>{" "}
            and generate your API key.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[15px] font-medium text-muted-foreground">
            <span>Enable AI for</span>
            <AudienceChip label="Faculties" checked={state.faculties} onToggle={() => update({ faculties: !state.faculties })} />
            <AudienceChip label="Students" checked={state.students} onToggle={() => update({ students: !state.students })} />
            <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <span>Enable Games</span>
            <Switch checked={state.games} onCheckedChange={(v) => update({ games: v })} aria-label="Enable games" />
          </div>

          <div className="mt-8 flex items-center gap-4 border-t border-border pt-5">
            <Button type="button" onClick={save} className="rounded-full px-6">
              Save
            </Button>
            {saved && (
              <span role="status" className="text-sm text-status-good">
                Settings saved
              </span>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
