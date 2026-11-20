"use client";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger, getLenis, isNavigating, refreshSoon } from "@/lib/gsap";
import { bestWork, type Stop } from "@/lib/content";

const N = bestWork.length;
const WHEEL_R = 22; // px, for wheel spin maths
// The ride is one scroll-scrubbed timeline. The first train pulls in during [0, LEAD];
// station k sits at time LEAD + k. Between stations: doors close, depart, next train arrives, doors open.
const LEAD = 0.6;
const TOTAL = LEAD + (N - 1);
const clampIdx = (i: number) => Math.max(0, Math.min(N - 1, i));

export default function BestWork() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const train = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const want = useRef(0); // station currently shown (arrows/keys step from here)

  // scroll position where station idx is docked
  const posFor = (idx: number) => {
    const t = st.current;
    return t ? t.start + ((LEAD + idx) / TOTAL) * (t.end - t.start) + 1 : null;
  };

  const [shown, setShown] = useState(0);
  const [docked, setDocked] = useState(false);
  const [board, setBoard] = useState(`Platform 1 · Next train: ${bestWork[0].station}`);

  useGSAP(
    () => {
      const far = () => window.innerWidth * 1.8;
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

      // first train pulls in
      tl.set(train.current, { x: far }, 0)
        .set(".door-l", { xPercent: 0 }, 0)
        .set(".door-r", { xPercent: 0 }, 0)
        .set(".sign", { opacity: 0, x: 60 }, 0)
        .to(".sign", { x: 0, opacity: 1, duration: 0.15 }, 0.05)
        .to(train.current, { x: 0, duration: 0.4, ease: "power3.out" }, 0.05)
        .to(".door-l", { xPercent: -100, duration: 0.1 }, 0.47)
        .to(".door-r", { xPercent: 100, duration: 0.1 }, 0.47);

      // every hop between stations
      for (let k = 0; k < N - 1; k++) {
        const t0 = LEAD + k;
        tl.to(".door-l", { xPercent: 0, duration: 0.1 }, t0 + 0.12)
          .to(".door-r", { xPercent: 0, duration: 0.1 }, t0 + 0.12)
          .to(train.current, { x: () => -far(), duration: 0.28, ease: "power2.in" }, t0 + 0.22)
          .to(".sign", { x: -60, opacity: 0, duration: 0.07 }, t0 + 0.42)
          .set(train.current, { x: far }, t0 + 0.5)
          .set(".sign", { x: 60 }, t0 + 0.5)
          .to(".sign", { x: 0, opacity: 1, duration: 0.08 }, t0 + 0.52)
          .to(train.current, { x: 0, duration: 0.3, ease: "power3.out" }, t0 + 0.5)
          .to(".map-train", { left: `${((k + 1) / (N - 1)) * 100}%`, duration: 0.6, ease: "power1.inOut" }, t0 + 0.2)
          .to(".door-l", { xPercent: -100, duration: 0.08 }, t0 + 0.83)
          .to(".door-r", { xPercent: 100, duration: 0.08 }, t0 + 0.83);
      }
      tl.set({}, {}, TOTAL); // pin the timeline length to TOTAL

      // Keep the UI in sync with wherever the timeline is (forwards or backwards).
      tl.eventCallback("onUpdate", () => {
        const x = gsap.getProperty(train.current, "x") as number;
        gsap.set(".wheel", { rotation: (-x / WHEEL_R) * 57.3 });

        const local = tl.time() - LEAD; // 0 = station 0, 1 = station 1, ...
        const idx = clampIdx(Math.floor(local + 0.5));
        const isDocked = local > -0.13 && Math.abs(local - Math.round(local)) < 0.12;
        want.current = idx;
        setShown(idx);
        setDocked(isDocked);
        const s = bestWork[idx];
        setBoard(
          isDocked
            ? `Now at: ${s.station} · Alight here for ${s.nearby} · Next: ${bestWork[idx + 1]?.station ?? "end of the line, all change"}`
            : local < -0.13
              ? `Platform 1 · Next train: ${bestWork[0].station}`
              : `Doors closing · Next stop: ${bestWork[clampIdx(Math.ceil(local))].station}`,
        );
      });

      st.current = ScrollTrigger.create({
        trigger: pin.current,
        pin: true,
        start: "top top",
        end: () => "+=" + TOTAL * window.innerHeight * 0.6,
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
      });

      // Let go of the wheel and the train eases into the nearest station, doors open.
      // (Done by hand: ScrollTrigger's built-in snap fights the smooth-scroll library.)
      const settle = () => {
        const t = st.current;
        if (!t || !t.isActive || isNavigating()) return;
        const local = t.progress * TOTAL - LEAD;
        if (local < -LEAD / 2) return; // still mostly before the platform: leave the visitor alone
        // follow the visitor's direction: a deliberate nudge carries on to the next stop
        const k = clampIdx(t.direction > 0 ? Math.ceil(local - 0.2) : Math.floor(local + 0.2));
        if (Math.abs(local - k) < 0.015) return;
        const y = posFor(k);
        if (y !== null) getLenis()?.scrollTo(y, { duration: 0.7 });
      };
      ScrollTrigger.addEventListener("scrollEnd", settle);

      gsap.from(".w-intro > *", { y: 50, opacity: 0, stagger: 0.12, scrollTrigger: { trigger: ".w-intro", start: "top 70%" } });

      refreshSoon();
      return () => ScrollTrigger.removeEventListener("scrollEnd", settle);
    },
    { scope: root },
  );

  const jump = (i: number) => {
    const y = posFor(clampIdx(i));
    if (y === null) return;
    const l = getLenis();
    if (l) l.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };
  const jumpRef = useRef(jump);
  jumpRef.current = jump;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!st.current?.isActive) return;
      if (e.key === "ArrowRight") jumpRef.current(want.current + 1);
      if (e.key === "ArrowLeft") jumpRef.current(want.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const s = bestWork[shown];

  return (
    <section id="work" ref={root}>
      {/* boarding screen */}
      <div className="flex min-h-[100svh] items-center justify-center bg-metro px-4 py-24 text-center">
        <div className="w-intro max-w-3xl">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em]">04 · Best work</div>
          <h2 className="font-marker text-6xl leading-[0.9] sm:text-8xl">Welcome aboard.</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg sm:text-xl">
            This service calls at <b>Haymarket</b>, <b>Monument</b>, <b>Central</b>, <b>Gateshead</b> and{" "}
            <b>Gateshead Stadium</b>.
          </p>
          <p className="mt-3 font-hand text-2xl sm:text-3xl">Please mind the gap between the project and the README.</p>
          <div className="mt-8 inline-flex items-center gap-3 border-2 border-ink bg-ink px-6 py-3 font-mono text-sm uppercase tracking-widest text-metro hard-shadow">
            Head to platform 1 ↓
          </div>
        </div>
      </div>

      {/* the platform */}
      <div ref={pin} className="paper relative flex h-[100svh] flex-col overflow-hidden pt-11">
        {/* top: sign + line map + board */}
        <div className="relative z-20 px-3 pt-3 sm:px-10 sm:pt-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
            <div className="flex items-start justify-between gap-2">
              <Sign s={s} i={shown} />
              <div className="flex shrink-0 gap-2 md:hidden">
                <button aria-label="Previous station (mobile)" onClick={() => jump(want.current - 1)} className="border-2 border-ink bg-paper px-3 py-2 hard-shadow active:bg-metro">
                  ←
                </button>
                <button aria-label="Next station (mobile)" onClick={() => jump(want.current + 1)} className="border-2 border-ink bg-metro px-3 py-2 hard-shadow">
                  →
                </button>
              </div>
            </div>
            <div className="[@media(max-height:820px)]:hidden">
              <LineMap shown={shown} onPick={jump} />
            </div>
          </div>
          <div className="mt-3 overflow-hidden border-2 border-ink bg-black py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-[#ffb000] sm:mt-4 sm:text-sm [@media(max-height:820px)]:mt-2 [@media(max-height:820px)]:py-1">
            <div className="marquee flex w-max whitespace-nowrap">
              {[0, 1].map((k) => (
                <span key={k} className="flex">
                  <span className="px-10">{board}</span>
                  <span className="px-10">{board}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* train */}
        <div className="relative z-10 mt-3 min-h-0 flex-1 sm:mt-5 [@media(max-height:820px)]:mt-2">
          <div className="absolute inset-x-0 -bottom-6 top-0 flex justify-center">
            <div ref={train} className="flex h-full shrink-0 items-end will-change-transform">
              <Cab />
              <Coupler />
              <MainCar s={s} i={shown} docked={docked} />
              <Coupler />
              <Carriage />
            </div>
          </div>

          <button
            aria-label="Previous station"
            onClick={() => jump(want.current - 1)}
            className="absolute left-5 top-1/2 z-30 hidden -translate-y-1/2 border-2 border-ink bg-paper px-4 py-6 text-xl hard-shadow hover:bg-metro md:block"
          >
            ←
          </button>
          <button
            aria-label="Next station"
            onClick={() => jump(want.current + 1)}
            className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 border-2 border-ink bg-paper px-4 py-6 text-xl hard-shadow hover:bg-metro md:block"
          >
            →
          </button>
        </div>

        {/* platform edge */}
        <div className="relative z-20 h-[11vh] min-h-16 border-t-[10px] border-metro bg-[#2b2b2b] [@media(max-height:820px)]:h-14 [@media(max-height:820px)]:min-h-0 [@media(max-height:820px)]:border-t-[6px]">
          <div className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,#141414_0_18px,transparent_18px_36px)] opacity-40" />
          <div className="absolute left-4 top-4 font-mono text-xs font-bold uppercase tracking-[0.4em] text-metro sm:left-10 sm:text-sm">
            Mind the gap
          </div>
          <div className="absolute right-4 top-4 hidden font-mono text-xs uppercase tracking-[0.3em] text-paper/50 sm:right-10 sm:block">
            scroll or ← → to travel
          </div>
        </div>
      </div>
    </section>
  );
}

function Sign({ s, i }: { s: Stop; i: number }) {
  return (
    <div className="sign min-w-0">
      <div className="inline-block border-4 border-ink bg-white hard-shadow">
        <div className="h-2.5 bg-metro" />
        <div className="px-4 py-2 sm:px-6 sm:py-3 [@media(max-height:820px)]:py-1.5">
          <div className="text-3xl font-bold uppercase leading-none tracking-tight sm:text-5xl lg:text-6xl [@media(max-height:820px)]:text-4xl">{s.station}</div>
        </div>
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60 sm:text-xs [@media(max-height:820px)]:mt-1">
        Stop {i + 1} of {N} · Alight here for <span className="font-bold text-ink">{s.nearby}</span>
      </div>
    </div>
  );
}

function LineMap({ shown, onPick }: { shown: number; onPick: (i: number) => void }) {
  return (
    <div className="w-full rotate-[-1deg] border-2 border-ink bg-white px-5 pb-2 pt-3 hard-shadow md:max-w-xl lg:max-w-2xl">
      <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60">
        <span>Sid Line</span>
        <span>Northbound ▸</span>
      </div>
      <div className="relative mx-3 h-12 sm:h-14">
        <div className="absolute inset-x-0 top-2.5 h-2 rounded bg-metro ring-2 ring-ink" />
        {bestWork.map((b, i) => (
          <button
            key={b.station}
            onClick={() => onPick(i)}
            aria-label={`Go to ${b.station}`}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${(i / (N - 1)) * 100}%` }}
          >
            <span className={`block h-7 w-7 rounded-full border-4 border-ink ${i === shown ? "bg-ink" : "bg-white"}`} />
            <span
              className={`absolute top-8 whitespace-nowrap font-mono text-[9px] font-bold uppercase sm:text-[10px] ${
                i === 0 ? "left-0" : i === N - 1 ? "right-0" : "left-1/2 -translate-x-1/2"
              } ${i === shown ? "text-delhi" : "hidden text-ink/70 sm:block"}`}
            >
              {b.station}
            </span>
          </button>
        ))}
        {/* little train on the map */}
        <div className="map-train pointer-events-none absolute -top-4 -translate-x-1/2" style={{ left: "0%" }}>
          <svg width="30" height="14" viewBox="0 0 30 14">
            <rect x="1" y="1" width="28" height="11" rx="4" fill="var(--color-delhi)" stroke="var(--color-ink)" strokeWidth="2" />
            <rect x="5" y="4" width="5" height="4" rx="1" fill="white" />
            <rect x="12.5" y="4" width="5" height="4" rx="1" fill="white" />
            <rect x="20" y="4" width="5" height="4" rx="1" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ---------- the train ---------- */

function Wheels() {
  return (
    <div className="absolute -bottom-3 inset-x-[8%] flex justify-between">
      {[0, 1].map((g) => (
        <div key={g} className="flex gap-2">
          {[0, 1].map((w) => (
            <div key={w} className="wheel relative h-11 w-11 rounded-full border-4 border-ink bg-[#3a3a3a]">
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-ink" />
              <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-ink" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Skirt({ label }: { label?: string }) {
  return (
    <div className="relative h-14 shrink-0 border-t-4 border-ink bg-[#2b2b2b]">
      {label && (
        <div className="absolute left-5 top-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-metro">{label}</div>
      )}
      <Wheels />
    </div>
  );
}

function Windows() {
  return (
    <div className="flex flex-1 items-start gap-[5%] px-[6%] pt-6">
      {[0, 1, 2, 3].map((k) => (
        <div key={k} className="relative h-[42%] flex-1 overflow-hidden rounded-lg border-4 border-ink bg-[#1d2430]">
          <div className="absolute -left-1/2 top-0 h-full w-1/3 rotate-12 bg-white/10" />
        </div>
      ))}
    </div>
  );
}

function Cab() {
  return (
    <div className="train-body relative flex h-full w-[75vw] flex-col overflow-hidden rounded-l-[90px] rounded-tr-[22px] border-4 border-ink bg-metro">
      <div className="h-5 shrink-0 border-b-4 border-ink bg-[#3a3a3a]" />
      <div className="relative flex flex-1">
        <div className="ml-6 mt-6 h-[42%] w-[22%] rounded-l-[60px] rounded-r-lg border-4 border-ink bg-[#1d2430]" />
        <Windows />
        <div className="absolute bottom-6 left-6 h-5 w-9 rounded-full border-4 border-ink bg-white shadow-[0_0_20px_8px_rgba(255,255,220,.6)]" />
      </div>
      <Skirt />
    </div>
  );
}

function Carriage() {
  return (
    <div className="train-body relative flex h-full w-[75vw] flex-col overflow-hidden rounded-t-[22px] border-4 border-ink bg-metro">
      <div className="h-5 shrink-0 border-b-4 border-ink bg-[#3a3a3a]" />
      <Windows />
      <Skirt />
    </div>
  );
}

function Coupler() {
  return <div className="mb-16 h-7 w-4 shrink-0 self-end border-y-4 border-ink bg-[#3a3a3a]" />;
}

function Door() {
  return (
    <div className="relative hidden w-20 shrink-0 overflow-hidden rounded-t-lg border-4 border-ink bg-[#121212] lg:block">
      <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-paper/20" />
      {(["door-l left-0 border-r-2", "door-r right-0 border-l-2"] as const).map((c) => (
        <div key={c} className={`${c} absolute inset-y-0 w-1/2 border-ink bg-metro`}>
          <div className="mx-1.5 mt-5 h-1/3 rounded border-2 border-ink bg-[#1d2430]" />
        </div>
      ))}
    </div>
  );
}

function MainCar({ s, i, docked }: { s: Stop; i: number; docked: boolean }) {
  return (
    <div className="train-body relative flex h-full w-[94vw] max-w-[1200px] flex-col overflow-hidden rounded-t-[22px] border-4 border-ink bg-metro">
      <div className="flex h-5 shrink-0 items-center justify-center border-b-4 border-ink bg-[#3a3a3a] font-mono text-[9px] uppercase tracking-[0.4em] text-metro">
        Sid Line · Car {String(i + 1).padStart(2, "0")}
      </div>
      <div className="flex min-h-0 flex-1 gap-3 p-2.5 sm:p-3">
        <Door />
        {/* the big window: project inside */}
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-xl border-4 border-ink bg-paper">
          <div className="pointer-events-none absolute -left-20 top-0 h-full w-40 rotate-12 bg-white/30" />
          <FitBox deps={[s.station]}>
          <div className="w-content grid gap-5 p-4 sm:p-6 md:grid-cols-[0.75fr_1.25fr]">
            <div className="hidden flex-col justify-between border-r-2 border-dashed border-ink/25 pr-5 md:flex">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">Now boarding</div>
                <p className="mt-2 font-hand text-2xl leading-tight lg:text-3xl">{s.joke}</p>
              </div>
              <div key={s.station + docked} className={`mt-3 flex flex-wrap items-start gap-x-3 gap-y-3 ${docked ? "" : "invisible"}`}>
                {s.stats.map((st, k) => (
                  <Sticker key={st.value + k} st={st} k={k} />
                ))}
              </div>
            </div>
            <div className="flex min-h-0 flex-col">
              <div className="mb-2 flex items-start justify-between gap-3 md:hidden">
                <p className="font-hand text-lg leading-tight text-delhi">{s.joke}</p>
                <div key={s.station + docked} className={docked ? "" : "invisible"}>
                  <Sticker st={s.stats[0]} k={0} small />
                </div>
              </div>
              <h3 className="text-xl font-bold leading-tight sm:text-3xl">{s.title}</h3>
              <p className="mt-1.5 text-sm text-ink/75 sm:text-base">{s.summary}</p>
              <ul className="mt-3 space-y-1.5 text-[13px] sm:text-[15px] [&>li:nth-child(n+3)]:hidden sm:[&>li:nth-child(n+3)]:flex">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-delhi" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                {s.tags.map((t) => (
                  <span key={t} className="hidden border border-ink bg-white px-2 py-0.5 font-mono text-[10px] uppercase sm:inline">
                    {t}
                  </span>
                ))}
                {s.links && (
                  <span className="flex gap-1.5 sm:ml-auto">
                    {s.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-delhi px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-paper hover:bg-ink"
                      >
                        {l.label} ↗
                      </a>
                    ))}
                  </span>
                )}
              </div>
            </div>
          </div>
          </FitBox>
        </div>
        <Door />
      </div>
      <Skirt label={`Sid Line · ${s.station}`} />
    </div>
  );
}

const STICKER_TILT = ["rotate-[-6deg]", "rotate-[5deg]", "rotate-[-3deg]"];
const STICKER_BG = ["bg-metro", "bg-white", "bg-[#bfe3ff]"];

function Sticker({ st, k, small }: { st: Stop["stats"][number]; k: number; small?: boolean }) {
  return (
    <div className={`w-sticker shrink-0 ${STICKER_TILT[k % 3]}`} style={{ animationDelay: `${k * 0.15}s` }}>
      <div
        className={`border-2 border-ink px-2 py-1 shadow-[3px_3px_0_var(--color-ink)] ${st.late ? "bg-tomato text-paper" : STICKER_BG[k % 3]} ${
          small ? "max-w-[7.5rem]" : "max-w-[10rem]"
        }`}
      >
        <div className={`font-marker leading-none ${small ? (st.value.length > 6 ? "text-base" : "text-xl") : st.value.length > 6 ? "text-2xl" : "text-3xl"}`}>{st.value}</div>
        <div className={`mt-0.5 font-mono font-bold uppercase leading-tight ${small ? "text-[8px]" : "text-[10px]"}`}>{st.label}</div>
      </div>
    </div>
  );
}

// Shrinks its content (CSS zoom) just enough to fit the space it's given, so nothing gets cut on short screens.
function FitBox({ children, deps }: { children: ReactNode; deps: unknown[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      i.style.zoom = "1";
      const need = i.scrollHeight;
      const have = o.clientHeight;
      i.style.zoom = String(Math.max(0.55, Math.min(1, have / need)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return (
    <div ref={outer} className="h-full overflow-hidden">
      <div ref={inner}>{children}</div>
    </div>
  );
}
