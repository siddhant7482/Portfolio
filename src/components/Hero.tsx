"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/content";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 2.1 });
      tl.from(".h-letter", { yPercent: 120, rotate: 12, stagger: 0.09, duration: 0.9, ease: "back.out(1.7)" })
        .to(".h-line", { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.5 }, "-=0.3")
        .from(".h-node", { scale: 0, transformOrigin: "50% 50%", stagger: 0.15, ease: "back.out(3)" }, "-=1.4")
        .from(".h-pop", { scale: 0.4, opacity: 0, stagger: 0.1, ease: "back.out(2)" }, "-=1")
        .from(".h-ladder > *", { x: -30, opacity: 0, stagger: 0.12 }, "-=0.6");

      gsap.to(".h-name", {
        yPercent: -35,
        scale: 0.85,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".h-float", {
        y: (i) => (i % 2 ? -80 : -140),
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="home" ref={root} className="paper relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-20">
      {/* sticker */}
      <div className="h-pop h-float tape absolute left-4 top-20 rotate-[-6deg] border-2 border-ink bg-white px-4 py-2 hard-shadow sm:left-12 sm:top-24">
        <div className="font-bold text-delhi">{site.sticker.top}</div>
        <div className="text-xs">{site.sticker.bottom}</div>
      </div>

      {/* night owl note */}
      <div className="h-pop h-float absolute right-4 top-20 hidden rotate-[3deg] text-right sm:right-12 sm:top-24 md:block">
        <div className="font-hand text-2xl leading-none">most productive between</div>
        <div className="mt-1 inline-flex items-center gap-2 bg-ink px-3 py-1 font-mono text-lg text-metro">
          22:00 <span className="text-paper/50">→</span> 03:00
        </div>
        <div className="mt-1 font-hand text-lg text-ink/60">certified night owl</div>
      </div>

      {/* name */}
      <div className="h-name relative text-center">
        <div className="absolute -top-4 left-1/2 w-max -translate-x-1/2 font-hand text-xl text-ink/60 sm:-top-6 sm:text-2xl">
          {site.nickNote}
        </div>
        <h1 className="flex justify-center overflow-hidden font-marker text-[44vw] leading-[0.95] sm:text-[24vw] lg:text-[20rem]">
          {site.nick.split("").map((c, i) => (
            <span key={i} className={`h-letter inline-block ${i === 1 ? "text-delhi" : ""}`}>
              {c}
            </span>
          ))}
        </h1>

        {/* the line: Delhi blue → flight → Newcastle yellow */}
        <svg viewBox="0 0 1000 90" className="mx-auto -mt-[4vw] w-[90vw] max-w-4xl overflow-visible">
          <path className="h-line" d="M30 45 C 200 10, 300 80, 440 45" pathLength={1} strokeDasharray="1" strokeDashoffset="1" fill="none" stroke="var(--color-delhi)" strokeWidth="10" strokeLinecap="round" />
          <path className="h-line" d="M440 45 Q 500 -10 560 45" pathLength={1} strokeDasharray="1" strokeDashoffset="1" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
          <path className="h-line" d="M560 45 C 700 10, 800 80, 970 45" pathLength={1} strokeDasharray="1" strokeDashoffset="1" fill="none" stroke="var(--color-metro)" strokeWidth="10" strokeLinecap="round" />
          <g className="h-node"><circle cx="30" cy="45" r="14" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="5" /></g>
          <g className="h-node"><circle cx="500" cy="18" r="0" /><text x="500" y="20" textAnchor="middle" fontSize="34">✈</text></g>
          <g className="h-node"><circle cx="970" cy="45" r="14" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="5" /></g>
          <text x="30" y="88" textAnchor="middle" className="fill-ink font-mono text-[20px] font-bold">DEL</text>
          <text x="970" y="88" textAnchor="middle" className="fill-ink font-mono text-[20px] font-bold">NCL</text>
        </svg>

        <p className="h-pop mx-auto mt-6 max-w-2xl font-hand text-3xl leading-tight sm:text-4xl">
          <span className="bg-metro px-2 box-decoration-clone">{site.tagline}</span>
        </p>
        <p className="h-pop mt-3 font-mono text-xs uppercase tracking-[0.25em] text-ink/70">{site.role}</p>
      </div>

      {/* ladder */}
      <div className="h-ladder absolute bottom-24 left-4 hidden space-y-3 sm:left-12 lg:block">
        {site.ladder.map((l) => (
          <div key={l.k} className="border-l-2 border-dashed border-ink/40 pl-3">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink/50">{l.k}</div>
            <div className="font-hand text-2xl leading-none">{l.v}</div>
          </div>
        ))}
      </div>

      <div className="h-pop absolute bottom-24 right-4 font-hand text-xl text-ink/60 sm:right-12">
        mind the gap, scroll down ↓
      </div>
    </section>
  );
}
