"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, scrollToId } from "@/lib/gsap";
import { nav, site, ticker } from "@/lib/content";

const TRACKED = ["home", "origin", "journey", "arrival", "work", "depot", "contact"];

export default function Chrome() {
  const [active, setActive] = useState("home");
  const [pct, setPct] = useState(0);
  const cursor = useRef<HTMLDivElement>(null);

  // Section tracking + progress. Wait a tick so section pins exist first.
  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const id = window.setTimeout(() => {
      triggers = TRACKED.map((sid) =>
        ScrollTrigger.create({
          trigger: `#${sid}`,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(sid),
        }),
      );
      triggers.push(
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => setPct(Math.round(self.progress * 100)),
        }),
      );
      ScrollTrigger.refresh();
    }, 300);
    return () => {
      window.clearTimeout(id);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // Custom cursor
  useEffect(() => {
    const el = cursor.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const t = e.target as HTMLElement;
      el.dataset.hover = t.closest("a,button") ? "1" : "0";
    };
    window.addEventListener("pointermove", move);
    el.style.opacity = "1";
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const navActive = active;

  return (
    <>
      {/* top bar: name roundel · ticker · mini route that fills as you scroll */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-11 items-center gap-4 bg-paper/95 px-3 backdrop-blur-sm sm:px-5">
        {/* ticket-style perforated edge */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-[3px] h-[3px] bg-[repeating-linear-gradient(90deg,var(--color-ink)_0_10px,transparent_10px_16px)]" />
        <button onClick={() => scrollToId("home")} className="flex shrink-0 items-center gap-2" aria-label="Back to top">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-metro font-marker text-sm leading-none text-ink">
            S
          </span>
          <span className="font-marker text-base leading-none">
            {site.nick}
            <span className="ml-1.5 hidden font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/60 sm:inline">{site.fullName}</span>
          </span>
        </button>
        <div className="hidden min-w-0 flex-1 justify-center overflow-hidden font-hand text-lg md:flex">
          <span key={active} className="truncate animate-[fadeIn_.5s_ease]">
            {ticker[active]}
          </span>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider" aria-label={`Journey ${pct}% complete`}>
          <span>DEL</span>
          <span className="relative block h-1.5 w-24 rounded-full bg-ink/15 sm:w-36">
            <span className="absolute inset-y-0 left-0 rounded-full bg-delhi" style={{ width: `${pct}%` }} />
            {/* the little train */}
            <span
              className="absolute top-1/2 h-3 w-5 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border-2 border-ink bg-metro"
              style={{ left: `${pct}%` }}
            />
          </span>
          <span>NCL</span>
        </div>
      </header>

      {/* bottom nav: a metro line, one station per section */}
      <nav className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2" aria-label="Sections">
        <ul className="relative flex items-center rounded-full bg-ink px-3 py-1.5 shadow-[0_6px_18px_rgba(0,0,0,.25)] sm:px-4">
          {/* the line itself */}
          <span className="pointer-events-none absolute inset-x-6 top-[11.5px] h-[3px] rounded-full bg-metro/80" />
          {nav.map((n) => {
            const on = navActive === n.id;
            return (
              <li key={n.id} className={["arrival", "origin", "journey"].includes(n.id) ? "hidden sm:block" : ""}>
                <button onClick={() => scrollToId(n.id)} className="group relative flex flex-col items-center px-2 sm:px-3" aria-current={on ? "true" : undefined}>
                  <span className="relative z-10 flex h-3.5 w-3.5 items-center justify-center">
                    <span
                      className={`block rounded-full border-2 transition-all ${
                        on ? "h-3.5 w-3.5 border-metro bg-metro shadow-[0_0_10px_rgba(255,196,0,.7)]" : "h-2.5 w-2.5 border-metro bg-ink group-hover:bg-metro/60"
                      }`}
                    />
                  </span>
                  <span
                    className={`mt-0.5 whitespace-nowrap font-hand text-base leading-none transition-colors sm:text-lg ${
                      on ? "text-metro" : "text-paper/75 group-hover:text-paper"
                    }`}
                  >
                    {n.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* cursor */}
      <div
        ref={cursor}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-delhi opacity-0 transition-[width,height,margin] duration-200 data-[hover=1]:-ml-7 data-[hover=1]:-mt-7 data-[hover=1]:h-14 data-[hover=1]:w-14 data-[hover=1]:border-metro"
      >
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-metro" />
      </div>
    </>
  );
}
