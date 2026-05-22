"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Code2,
  Binary,
  MapPin,
  Calendar,
  Clock,
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

function stagger(delay: number) {
  return {
    ...fadeUp,
    transition: { ...fadeUp.transition, delay },
  };
}

export default function Flyer() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-light/60 to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div {...stagger(0)}>
            <Image
              src="/logo.png"
              alt="GVCS Logo"
              width={72}
              height={72}
              className="mx-auto mb-6 rounded-lg shadow-sm"
            />
          </motion.div>

          <motion.p
            {...stagger(0.05)}
            className="font-mono text-sm text-primary tracking-widest uppercase mb-3"
          >
            Great Valley Computer Science Club presents
          </motion.p>

          <motion.h1
            {...stagger(0.1)}
            className="font-heading text-5xl sm:text-6xl font-bold text-foreground mb-4 tracking-tight"
          >
            Hack the Valley
          </motion.h1>

          <motion.p
            {...stagger(0.15)}
            className="text-lg text-muted max-w-xl mx-auto mb-8"
          >
            Two hackathons. One mission.{" "}
            <span className="text-primary font-medium">
              Build something amazing.
            </span>
          </motion.p>

          <motion.div
            {...stagger(0.2)}
            className="flex flex-wrap justify-center gap-3 text-sm"
          >
            {[
              "Open to all GV students",
              "No experience required",
              "Free to enter",
            ].map((item) => (
              <span
                key={item}
                className="px-4 py-1.5 rounded-full bg-white border border-border text-muted font-medium"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Two Hackathons */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Project Hackathon */}
          <motion.div
            {...stagger(0)}
            className="rounded-2xl border border-border bg-white p-8 relative overflow-hidden group hover:border-border-blue hover:shadow-md transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/40 rounded-bl-full pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary text-white">
                  Flagship
                </span>
              </div>

              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                Hack the Valley: Project
              </h2>

              <p className="text-muted text-sm leading-relaxed mb-6">
                Our flagship build hackathon. Teams of 2–4 create a full project
                in one day — web apps, games, tools, anything goes. Mentors,
                prizes, and food provided.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-foreground">
                  <Users className="w-4 h-4 text-primary shrink-0" />
                  <span>Teams of 2–4</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Full-day build sprint</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Trophy className="w-4 h-4 text-primary shrink-0" />
                  <span>Prizes for top projects</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>Great Valley High School</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Algorithms Hackathon */}
          <motion.div
            {...stagger(0.1)}
            className="rounded-2xl border border-border bg-white p-8 relative overflow-hidden group hover:border-border-blue hover:shadow-md transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/40 rounded-bl-full pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                  <Binary className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary text-white">
                  Competitive
                </span>
              </div>

              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                Hack the Valley: Algorithms
              </h2>

              <p className="text-muted text-sm leading-relaxed mb-6">
                A competitive programming contest. Solve algorithmic challenges
                under time pressure. Individual or pair format. Great prep for
                USACO and coding interviews.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-foreground">
                  <Users className="w-4 h-4 text-primary shrink-0" />
                  <span>Individual or pairs</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Timed contest rounds</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Trophy className="w-4 h-4 text-primary shrink-0" />
                  <span>Leaderboard + prizes</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>Microsoft Office — Malvern, PA</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="bg-background-alt py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...stagger(0)} className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">
              What to Expect
            </h2>
            <div className="h-1 w-12 rounded-full bg-primary mx-auto" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: "Mentorship",
                desc: "Industry mentors and experienced student leads on-site to help you build",
              },
              {
                icon: <Trophy className="w-5 h-5" />,
                title: "Prizes",
                desc: "Awards for best project, best design, most creative, and more",
              },
              {
                icon: <Users className="w-5 h-5" />,
                title: "Community",
                desc: "Meet other GV students who love CS — beginners and veterans alike",
              },
              {
                icon: <Code2 className="w-5 h-5" />,
                title: "Experience",
                desc: "Build real projects for your portfolio and sharpen competitive skills",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...stagger(i * 0.08)}
                className="rounded-xl border border-border bg-white p-6 text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary mx-auto mb-3">
                  {item.icon}
                </div>
                <h3 className="font-heading font-bold text-foreground mb-1.5">
                  {item.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...stagger(0)}>
            <p className="font-mono text-sm text-primary tracking-widest uppercase mb-6">
              Sponsored by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-70">
              <Image
                src="/sponsors/microsoft.svg"
                alt="Microsoft"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <Image
                src="/sponsors/sig.svg"
                alt="SIG"
                width={80}
                height={40}
                className="h-8 w-auto"
              />
              <Image
                src="/sponsors/gv.png"
                alt="Great Valley"
                width={80}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...stagger(0)}>
            <h2 className="font-heading text-3xl font-bold text-white mb-3">
              Ready to hack?
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              Follow us for announcements on dates, registration, and details.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-primary-light transition-colors"
            >
              View All Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-muted text-sm">
            Great Valley Computer Science Club · Great Valley High School ·
            Malvern, PA
          </p>
        </div>
      </footer>
    </div>
  );
}
