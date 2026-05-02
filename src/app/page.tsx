"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SponsorMarquee } from "@/components/SponsorMarquee";

const ScrollVideo = dynamic(
  () => import("@/components/ScrollVideo").then((m) => m.ScrollVideo),
  { ssr: false }
);

export default function Home() {
  return (
    <div>
      {/* Scroll-driven hero scene — laptop + animated elements all in one layer */}
      <ScrollVideo />

      {/* Sponsors */}
      <SponsorMarquee />

      {/* Content below the scroll scene */}
      <section className="bg-background-alt py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Ready to get involved?
            </h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">
              Check out our upcoming hackathons and external competitions.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
            >
              View Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border-blue p-10 text-center"
        >
          <p className="font-mono text-primary text-sm mb-2">
            {"// coming soon"}
          </p>
          <h2 className="font-heading text-xl font-bold text-foreground mb-3">
            CS Courses & Contest Guide
          </h2>
          <p className="text-muted max-w-lg mx-auto">
            We&apos;re building a curated guide to the best CS courses and a
            full contest calendar. Stay tuned.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
