"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP, lockScroll, unlockScroll } from "@/lib/gsap";

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      lockScroll();
      let released = false;
      const release = () => {
        if (!released) unlockScroll();
        released = true;
      };
      const o = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          release();
          setGone(true);
        },
      });
      tl.from(".ld-row", { opacity: 0, x: -20, stagger: 0.12, duration: 0.4 })
        .to(o, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: () => setN(Math.round(o.v)) }, 0)
        .to(root.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "+=0.15");
      return release; // never leave the page locked (e.g. React dev double-mount)
    },
    { scope: root },
  );

  if (gone) return null;
  const due = n < 100 ? `${Math.max(1, Math.ceil((100 - n) / 34))} min` : "Due";

  return (
    <div ref={root} className="fixed inset-0 z-[200] flex items-center justify-center bg-night px-4 font-mono text-metro">
      <div className="w-full max-w-xl">
        <div className="ld-row mb-4 flex justify-between border-b border-metro/30 pb-2 text-xs uppercase tracking-[0.3em] text-metro/60">
          <span>Platform 1</span>
          <span>Departures</span>
        </div>
        <div className="ld-row flex items-baseline justify-between text-2xl sm:text-4xl">
          <span>1&nbsp;&nbsp;Sid</span>
          <span className="ld-status">{due}</span>
        </div>
        <div className="ld-row mt-2 text-sm text-metro/70">Calling at: Delhi, Pune, Noida, Newcastle, Gateshead</div>
        <div className="ld-row mt-8 h-1 w-full bg-metro/15">
          <div className="h-full bg-metro" style={{ width: `${n}%` }} />
        </div>
        <div className="ld-row mt-2 text-right text-xs text-metro/60">{n}%</div>
      </div>
    </div>
  );
}
