"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { arrival } from "@/lib/content";
import { ART, type ArtKey, TyneBridge } from "./NewcastleArt";

export default function Arrival() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".a-head > *", { y: 40, opacity: 0, stagger: 0.12, scrollTrigger: { trigger: ".a-head", start: "top 75%" } });

      // Everything pinned to the board drops in as it scrolls into view.
      // (entrance uses yPercent, parallax below uses y, so they don't fight)
      gsap.set(".pb-item", { opacity: 0, yPercent: 25, scale: 0.92 });
      ScrollTrigger.batch(".pb-item", {
        start: "top 88%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, yPercent: 0, scale: 1, stagger: 0.09, duration: 0.7, ease: "back.out(1.6)" }),
      });

      const tl = gsap.timeline({ scrollTrigger: { trigger: ".a-receipt", start: "top 80%" } });
      tl.from(".a-receipt", { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "power2.inOut" })
        .from(".a-line", { opacity: 0, x: -10, stagger: 0.12 }, "-=0.5")
        .from(".a-total", { scale: 2, opacity: 0, ease: "back.out(2)" });

      // a little parallax so the board feels layered
      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
        gsap.to(el, {
          y: () => -Number(el.dataset.depth) * 60,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  const r = arrival.receipt;

  return (
    <section id="arrival" ref={root} className="paper relative overflow-hidden px-4 py-28 sm:px-10">
      {/* faint river line across the board */}
      <svg className="pointer-events-none absolute inset-x-0 top-[38%] h-40 w-full opacity-[0.12]" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <path d="M0 60 C 200 10, 350 100, 520 50 S 850 20, 1000 70" fill="none" stroke="var(--color-delhi)" strokeWidth="30" />
      </svg>

      <div className="relative mx-auto max-w-7xl">
        {/* ---------- row 1 ---------- */}
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <div className="a-head relative">
              <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-delhi">03 · Newcastle</div>
              <h2 className="font-marker text-6xl leading-none sm:text-8xl">Day one.</h2>
              <p className="mt-4 max-w-xl font-hand text-2xl sm:text-3xl">{arrival.intro}</p>
            </div>

            <div className="mt-10 flex flex-wrap items-start gap-8">
              <UniCard />
              <div className="pb-item lift relative rotate-[6deg] rounded-full bg-tomato px-5 py-2 font-marker text-2xl text-paper hard-shadow" data-depth="1.2">
                HOWAY!
              </div>
            </div>
          </div>

          {/* postcard */}
          <div className="pb-item lift relative rotate-[2.5deg]" data-depth="0.5">
            <Pin />
            <div className="border-[10px] border-white bg-white shadow-[0_25px_50px_-20px_rgba(0,0,0,.45)]">
              <div className="relative">
                <TyneBridge className="block h-auto w-full" />
                <div className="absolute left-4 top-3 sm:left-6 sm:top-5">
                  <div className="font-hand text-2xl text-ink sm:text-3xl">{arrival.postcard}</div>
                  <div
                    className="font-marker text-4xl leading-none text-metro sm:text-6xl"
                    style={{ WebkitTextStroke: "2px var(--color-ink)", textShadow: "4px 4px 0 var(--color-ink)" }}
                  >
                    NEWCASTLE
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/70 sm:text-xs">upon Tyne · Tyne Bridge</div>
                </div>
              </div>
            </div>
            {/* stamp */}
            <div className="absolute -right-3 -top-5 hidden rotate-[8deg] border-2 border-dashed border-ink bg-paper p-1.5 sm:block">
              <div className="flex h-16 w-14 flex-col items-center justify-center bg-delhi text-paper">
                <span className="font-marker text-lg leading-none">NE1</span>
                <span className="font-mono text-[8px]">1ST CLASS</span>
              </div>
            </div>
            {/* sticker */}
            <div className="pb-item absolute -bottom-10 -left-6 flex h-28 w-28 rotate-[-14deg] items-center justify-center rounded-full border-4 border-ink bg-metro text-center font-marker text-xl leading-none hard-shadow sm:-left-10">
              WHY
              <br />
              AYE
            </div>
          </div>
        </div>

        {/* ---------- row 2 ---------- */}
        <div className="mt-24 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {/* col 1 */}
          <div className="space-y-14">
            <div className="a-receipt receipt-edge mx-auto w-full max-w-[380px] rotate-[-2deg] bg-white px-7 pb-10 pt-7 font-mono text-sm shadow-[0_20px_40px_-20px_rgba(0,0,0,.4)]">
              <div className="text-center">
                <div className="text-2xl font-bold tracking-[0.25em]">{r.venue}</div>
                <div className="text-xs text-ink/60">{r.city}</div>
                <div className="mt-1 text-xs text-ink/60">TABLE 1 · DAY 1 IN THE UK</div>
              </div>
              <div className="my-4 border-t-2 border-dashed border-ink/40" />
              {r.lines.map((l) => (
                <div key={l} className="a-line flex justify-between py-0.5">
                  <span>{l}</span>
                  <span className="text-ink/40">✓</span>
                </div>
              ))}
              <div className="my-4 border-t-2 border-dashed border-ink/40" />
              <div className="a-total flex items-baseline justify-between text-base font-bold">
                <span>TOTAL</span>
                <span className="font-hand text-3xl font-normal text-tomato">{r.total}</span>
              </div>
              <div className="my-4 border-t-2 border-dashed border-ink/40" />
              {r.footer.map((f) => (
                <div key={f} className="text-center text-xs text-ink/60">
                  {f}
                </div>
              ))}
              <div className="mt-4 text-center tracking-[0.2em] text-ink/80">||| || ||| | |||| || |</div>
            </div>

            <Ticket />
          </div>

          {/* col 2 */}
          <div className="space-y-14">
            <Polaroid art="millennium" tilt="-rotate-[3deg]" depth={0.8} />
            <div className="pb-item lift tape relative rotate-[2deg] bg-metro p-6 hard-shadow">
              <div className="mb-3 font-mono text-xs uppercase tracking-widest">Things I love about Newcastle</div>
              <ul className="space-y-2 font-hand text-2xl leading-tight">
                {arrival.love.map((l) => (
                  <li key={l}>♥ {l}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* col 3 */}
          <div className="space-y-14 md:col-span-2 lg:col-span-1">
            <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-1">
              <div className="pb-item lift tape relative rotate-[-3deg] bg-delhi p-6 text-paper hard-shadow">
                <div className="mb-3 font-mono text-xs uppercase tracking-widest">Things I miss about Delhi</div>
                <ul className="space-y-2 font-hand text-2xl leading-tight">
                  {arrival.miss.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
              <Weather />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Polaroid art="monument" tilt="rotate-[4deg]" small depth={1} />
              <Polaroid art="angel" tilt="-rotate-[5deg]" small depth={0.6} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- board pieces ---------- */

function Pin({ color = "bg-tomato" }: { color?: string }) {
  return (
    <span
      className={`absolute -top-3 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-ink ${color} shadow-[2px_4px_0_rgba(0,0,0,.3)]`}
    />
  );
}

function Polaroid({ art, tilt, small, depth = 0 }: { art: ArtKey; tilt: string; small?: boolean; depth?: number }) {
  const p = arrival.photos[art as keyof typeof arrival.photos];
  const Art = ART[art];
  return (
    <figure className={`pb-item lift relative ${tilt} bg-white p-2.5 pb-0 shadow-[0_18px_35px_-18px_rgba(0,0,0,.5)] sm:p-3 sm:pb-0`} data-depth={depth}>
      <Pin color={small ? "bg-delhi" : "bg-tomato"} />
      {p?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.src} alt={p.caption} className="aspect-[4/5] w-full object-cover" />
      ) : (
        <Art className="block h-auto w-full" />
      )}
      <figcaption className={`px-1 py-2.5 text-center font-hand leading-tight ${small ? "text-base sm:text-lg" : "text-xl sm:text-2xl"}`}>
        {p?.caption}
      </figcaption>
    </figure>
  );
}

function UniCard() {
  const u = arrival.uni;
  const [logoOk, setLogoOk] = useState(true);
  const img = useRef<HTMLImageElement>(null);
  // onError can fire before React hydrates, so also check after mount.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setLogoOk(false);
  }, []);
  return (
    <div className="pb-item lift relative w-full max-w-sm rotate-[-2deg] border-2 border-ink bg-white p-5 hard-shadow" data-depth="0.4">
      <Pin color="bg-metro" />
      <div className="flex min-h-14 items-center">
        {logoOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={img} src={u.logo} alt={u.name} className="h-14 w-auto max-w-full object-contain" onError={() => setLogoOk(false)} />
        ) : (
          <div className="text-xl font-bold leading-none tracking-tight">{u.name}</div>
        )}
      </div>
      <div className="mt-4 border-t-2 border-dashed border-ink/30 pt-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{u.years}</div>
        <div className="mt-1 text-lg font-bold leading-tight">{u.course}</div>
        <div className="font-hand text-xl text-ink/70">(while working. sleep was optional.)</div>
      </div>
      <div className="absolute -bottom-5 -right-4 rotate-[-10deg] border-4 border-tomato bg-white/80 px-3 py-1 font-marker text-xl text-tomato">
        {u.result}
      </div>
    </div>
  );
}

function Ticket() {
  const t = arrival.ticket;
  return (
    <div className="pb-item lift relative mx-auto flex max-w-[380px] rotate-[3deg] border-2 border-ink bg-white hard-shadow" data-depth="0.7">
      <div className="flex w-14 items-center justify-center border-r-2 border-dashed border-ink bg-metro">
        <span className="-rotate-90 whitespace-nowrap font-mono text-xs font-bold tracking-[0.3em]">METRO</span>
      </div>
      <div className="flex-1 p-4 font-mono">
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-ink/60">
          <span>{t.kind}</span>
          <span>Adult</span>
        </div>
        <div className="mt-1 text-lg font-bold uppercase leading-tight">
          {t.from} <span className="text-delhi">→</span> {t.to}
        </div>
        <div className="mt-2 text-[11px] uppercase text-ink/70">{t.note}</div>
      </div>
    </div>
  );
}

function Weather() {
  const w = arrival.weather;
  return (
    <div className="pb-item lift relative rotate-[2deg] border-2 border-ink bg-[#dfe4ea] p-5 hard-shadow" data-depth="0.9">
      <Pin color="bg-ink" />
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 64 56" className="h-14 w-16 shrink-0" aria-hidden>
          <ellipse cx="34" cy="22" rx="22" ry="14" fill="#8a96a3" stroke="#141414" strokeWidth="2.5" />
          <ellipse cx="18" cy="28" rx="14" ry="10" fill="#9aa5b1" stroke="#141414" strokeWidth="2.5" />
          {[16, 28, 40].map((x) => (
            <line key={x} x1={x} y1="42" x2={x - 4} y2="52" stroke="#2050d0" strokeWidth="3" strokeLinecap="round" />
          ))}
        </svg>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60">{w.title}</div>
          <div className="text-lg font-bold leading-tight">{w.body}</div>
          <div className="font-hand text-2xl leading-none text-delhi">{w.punch}</div>
        </div>
      </div>
    </div>
  );
}
