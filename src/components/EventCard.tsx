"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

interface EventCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  tag?: string;
  href?: string;
  large?: boolean;
  delay?: number;
}

export function EventCard({
  title,
  description,
  icon,
  tag,
  href,
  large = false,
  delay = 0,
}: EventCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`rounded-xl border border-border hover:border-border-blue hover:shadow-sm transition-all duration-200 cursor-pointer group ${
        large ? "p-8" : "p-6"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-primary">{icon}</div>
        <div className="flex items-center gap-2">
          {tag && (
            <span className="text-xs font-mono px-2 py-1 rounded-full bg-primary-light text-primary">
              {tag}
            </span>
          )}
          {href && (
            <ExternalLink className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
      <h3
        className={`font-heading font-bold text-foreground mb-2 ${
          large ? "text-xl" : "text-lg"
        }`}
      >
        {title}
      </h3>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
