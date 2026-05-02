"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Trophy, BookOpen, ArrowRight } from "lucide-react";

const TOTAL_FRAMES = 96;
const FRAME_PATH = "/frames/frame-";

function getFrameSrc(index: number): string {
  const num = String(index + 1).padStart(4, "0");
  return `${FRAME_PATH}${num}.jpg`;
}

export function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Laptop scales down as it closes & rotates
  const laptopScale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.9, 0.85]);

  // Title fades and drifts
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Subtitle
  const subtitleY = useTransform(scrollYProgress, [0, 0.25], [0, -35]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Pill badges — float in from sides early
  const pill1X = useTransform(scrollYProgress, [0.08, 0.25], [-120, 0]);
  const pill1Opacity = useTransform(scrollYProgress, [0.08, 0.22], [0, 1]);

  const pill2X = useTransform(scrollYProgress, [0.12, 0.3], [120, 0]);
  const pill2Opacity = useTransform(scrollYProgress, [0.12, 0.26], [0, 1]);

  const pill3Y = useTransform(scrollYProgress, [0.16, 0.35], [60, 0]);
  const pill3Opacity = useTransform(scrollYProgress, [0.16, 0.3], [0, 1]);

  // Cards slide up from bottom
  const cardsY = useTransform(scrollYProgress, [0.35, 0.6], [80, 0]);
  const cardsOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);

  // CTA
  const ctaOpacity = useTransform(scrollYProgress, [0.65, 0.8], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.65, 0.8], [20, 0]);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
          drawFrame(0);
        }
      };
      images.push(img);
    }
  }, []);

  function drawFrame(index: number) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  }

  useEffect(() => {
    if (!loaded) return;

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }
    });

    return unsubscribe;
  }, [loaded, scrollYProgress]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Loading */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Title */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute top-[8%] left-0 right-0 text-center z-10"
        >
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-primary">
            Great Valley CS
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          style={{ opacity: subtitleOpacity, y: subtitleY }}
          className="absolute top-[18%] left-0 right-0 text-center z-10 text-base md:text-lg text-muted/80 tracking-wide"
        >
          Build. Compete. Innovate.
        </motion.p>

        {/* Laptop canvas */}
        <motion.div
          style={{ scale: laptopScale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            className={`max-w-[85%] max-h-[75vh] object-contain transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </motion.div>

        {/* Floating pill badges — smooth rounded indicators */}
        <motion.div
          style={{ x: pill1X, opacity: pill1Opacity }}
          className="absolute top-[35%] left-[6%] z-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Hackathons</span>
          </div>
        </motion.div>

        <motion.div
          style={{ x: pill2X, opacity: pill2Opacity }}
          className="absolute top-[32%] right-[6%] z-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Competitions</span>
          </div>
        </motion.div>

        <motion.div
          style={{ y: pill3Y, opacity: pill3Opacity }}
          className="absolute top-[45%] right-[14%] z-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Learning</span>
          </div>
        </motion.div>

        {/* Feature cards row — slides up together */}
        <motion.div
          style={{ y: cardsY, opacity: cardsOpacity }}
          className="absolute bottom-[12%] left-0 right-0 z-10 px-8"
        >
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-border/60 p-4 shadow-sm">
              <Code2 className="w-5 h-5 text-primary mb-2" />
              <div className="font-heading font-semibold text-foreground text-sm mb-1">Hackathons</div>
              <p className="text-muted text-xs leading-relaxed">24-hour builds with mentors and prizes.</p>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-border/60 p-4 shadow-sm">
              <Trophy className="w-5 h-5 text-primary mb-2" />
              <div className="font-heading font-semibold text-foreground text-sm mb-1">Competitions</div>
              <p className="text-muted text-xs leading-relaxed">USACO, CodeLM, and contests at every level.</p>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-border/60 p-4 shadow-sm">
              <BookOpen className="w-5 h-5 text-primary mb-2" />
              <div className="font-heading font-semibold text-foreground text-sm mb-1">Learning</div>
              <p className="text-muted text-xs leading-relaxed">Workshops and resources for all levels.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA button — smooth pill */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute bottom-[5%] left-0 right-0 text-center z-20"
        >
          <a
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            View Events
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
