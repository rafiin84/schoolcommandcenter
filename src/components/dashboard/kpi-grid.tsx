"use client";

import { motion } from "framer-motion";
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

export function KpiGrid({ cards }: { cards: KpiCardProps[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex gap-3 overflow-x-auto pb-1 sm:gap-4"
    >
      {cards.map((card) => (
        <motion.div key={card.label} variants={item} className="w-56 shrink-0 sm:w-64">
          <KpiCard {...card} />
        </motion.div>
      ))}
    </motion.div>
  );
}
