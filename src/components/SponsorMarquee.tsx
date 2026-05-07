"use client";

import { motion } from "framer-motion";

const sponsors = [
  { name: "SIG", logo: "/sponsors/sig.svg" },
  { name: "Microsoft", logo: "/sponsors/microsoft.svg" },
  { name: "Chickie's & Pete's", logo: "/sponsors/chickies.png" },
  { name: "Great Valley", logo: "/sponsors/gv.png" },
];

// Double the array for seamless loop
const marqueeItems = [...sponsors, ...sponsors];

export function SponsorMarquee() {
  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <p className="text-center text-muted text-sm font-mono uppercase tracking-wider">
          Our Sponsors
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-16 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {marqueeItems.map((sponsor, i) => (
            <div
              key={`${sponsor.name}-${i}`}
              className="flex items-center gap-3 px-6 py-4 rounded-lg border border-border bg-white shrink-0"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-8 w-auto object-contain"
              />
              <span className="font-heading font-semibold text-foreground text-sm whitespace-nowrap">
                {sponsor.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
