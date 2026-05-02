"use client";

import {
  Code2,
  Binary,
  Shield,
  Laptop,
  Globe,
  Cpu,
} from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { SectionHeading } from "@/components/SectionHeading";

const ourHackathons = [
  {
    title: "Hack the Valley: Project",
    description:
      "Our flagship hackathon. Teams of 2-4 build a full project in 24 hours — web apps, games, tools, anything goes. Mentors, prizes, and pizza included.",
    icon: <Code2 className="w-7 h-7" />,
    tag: "Flagship",
  },
  {
    title: "Hack the Valley: Algorithms",
    description:
      "A competitive programming contest. Solve algorithmic challenges under time pressure. Individual or pair format. Great prep for USACO and interview coding.",
    icon: <Binary className="w-7 h-7" />,
    tag: "Competitive",
  },
];

const externalEvents = [
  {
    title: "USACO",
    description:
      "The USA Computing Olympiad. Monthly online contests from Bronze to Platinum. The gold standard for competitive programming in high school.",
    icon: <Shield className="w-6 h-6" />,
    tag: "Competitive Programming",
    href: "https://usaco.org/",
  },
  {
    title: "Hackstoga",
    description:
      "A student-run hackathon bringing together high schoolers from the Philly area. Build something cool, meet new people, win prizes.",
    icon: <Laptop className="w-6 h-6" />,
    tag: "Hackathon",
    href: "https://hackstoga.com/",
  },
  {
    title: "CodeLM",
    description:
      "An AI-focused competition challenging students to build with large language models. Prompt engineering, fine-tuning, and creative applications.",
    icon: <Cpu className="w-6 h-6" />,
    tag: "AI Competition",
    href: "https://codelm.com/",
  },
  {
    title: "WCU Hackathon",
    description:
      "West Chester University's annual hackathon. Open to high school students. A great first hackathon experience with university mentors.",
    icon: <Globe className="w-6 h-6" />,
    tag: "Hackathon",
  },
  {
    title: "MLH Local Hackathons",
    description:
      "Major League Hacking runs hundreds of hackathons each season. Find one near you or attend virtually. Perfect for any skill level.",
    icon: <Globe className="w-6 h-6" />,
    tag: "Hackathon Network",
    href: "https://mlh.io/seasons/2025/events",
  },
];

export default function Events() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
      {/* Our Hackathons */}
      <section className="mb-20">
        <SectionHeading
          title="Our Hackathons"
          subtitle="Events we organize right here at Great Valley."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {ourHackathons.map((event, i) => (
            <EventCard key={event.title} {...event} large delay={i * 0.15} />
          ))}
        </div>
      </section>

      {/* External Events */}
      <section>
        <SectionHeading
          title="External Events"
          subtitle="Competitions and hackathons we encourage members to participate in."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {externalEvents.map((event, i) => (
            <EventCard key={event.title} {...event} delay={i * 0.1} />
          ))}
        </div>
      </section>
    </div>
  );
}
