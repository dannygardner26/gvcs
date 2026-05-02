"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h2 className="font-heading text-3xl font-bold text-primary mb-2">
        {title}
      </h2>
      <div className="h-1 w-12 rounded-full bg-primary" />
      {subtitle && <p className="text-muted mt-3 text-lg">{subtitle}</p>}
    </motion.div>
  );
}
