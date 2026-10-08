"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { KpiCard, type KpiCardProps } from "./kpi-card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function KpiGrid({ cards, title, variant = "tile" }: { cards: KpiCardProps[]; title?: string; variant?: "tile" | "banner" }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges, cards.length]);

  function scrollByCard(direction: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.firstElementChild?.clientWidth ?? 256) * 1.1, behavior: "smooth" });
  }

  const canScroll = !(edges.start && edges.end);

  return (
    <div>
      {(title || canScroll) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-lg lowercase leading-tight text-foreground">
              <span className="font-normal">{title.slice(0, title.lastIndexOf(" "))} </span>
              <span className="font-semibold">{title.slice(title.lastIndexOf(" ") + 1)}</span>
            </h2>
          ) : (
            <span />
          )}
          {canScroll && (
            <div className="flex items-center gap-6 pr-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={edges.start}
                aria-label="Previous"
                className="text-foreground/80 transition-opacity hover:text-primary disabled:opacity-30 disabled:hover:text-foreground/80"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={edges.end}
                aria-label="Next"
                className="text-foreground/80 transition-opacity hover:text-primary disabled:opacity-30 disabled:hover:text-foreground/80"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          )}
        </div>
      )}
      <motion.div
        ref={scroller}
        onScroll={updateEdges}
        variants={container}
        initial="hidden"
        animate="show"
        className="flex gap-3 overflow-x-auto pb-1 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <motion.div key={card.label} variants={item} className={variant === "banner" ? "w-[300px] shrink-0 sm:w-[400px]" : "w-56 shrink-0 sm:w-64"}>
            <KpiCard {...card} variant={variant} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
