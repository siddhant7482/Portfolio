"use client";
import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { depot, type DepotProject } from "@/lib/content";

const ALL = depot.tracks.flatMap((t) => t.projects);

export default function Depot() {
  const root = useRef<HTMLElement>(null);
  // Easter egg state: how many times someone tried to pull a flyer off, and what the Union said about it.
  const [strikes, setStrikes] = useState(0);
  const [slip, setSlip] = useState<{ title: string; text: string; barred?: boolean; key: number } | null>(null);
  const slipTimer = useRef<number | undefined>(undefined);

  const onPulled = () => {
    const n = Math.min(strikes + 1, depot.warnings.length);
    setStrikes(n);
    const w = depot.warnings[n - 1];
    window.clearTimeout(slipTimer.current);
    setSlip({ ...w, barred: n === depot.warnings.length, key: Date.now() });
    if (n < depot.warnings.length) slipTimer.current = window.setTimeout(() => setSlip(null), 4200);
  };
  const onBarredTry = () => {
    window.clearTimeout(slipTimer.current);
    setSlip({ title: "Barred", text: depot.barred, barred: true, key: Date.now() });
  };

  useGSAP(
    () => {
      gsap.from(".nb-head > *", { y: 40, opacity: 0, stagger: 0.1, scrollTrigger: { trigger: ".nb-head", start: "top 80%" } });
      // flyers get pinned up as they come into view
      gsap.set(".nb-flyer", { opacity: 0, yPercent: -12, scale: 1.06 });
      ScrollTrigger.batch(".nb-flyer", {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, yPercent: 0, scale: 1, stagger: 0.12, duration: 0.45, ease: "back.out(1.8)" }),
      });
    },
    { scope: root },
  );

  return (
    <section id="depot" ref={root} className="paper relative overflow-hidden px-4 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="nb-head mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-delhi">05 · Side projects</div>
            <h2 className="mt-2 font-marker text-6xl leading-none sm:text-7xl">{depot.sign}</h2>
            <div className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-ink/60">{depot.place}</div>
            <p className="mt-4 max-w-xl font-hand text-2xl leading-snug sm:text-3xl">{depot.intro}</p>
          </div>
        </div>

        {/* the board */}
        <div className="relative border-[14px] border-[#7a4a26] shadow-[10px_10px_0_var(--color-ink)] [border-image:linear-gradient(135deg,#8d5a30,#5c3618)_1]">
          <div className="cork relative px-4 pb-10 pt-14 sm:px-8">
            <div className="absolute right-4 top-3 hidden rotate-[4deg] bg-[#fff59d] px-3 py-1 font-hand text-lg leading-tight shadow-[2px_3px_0_rgba(0,0,0,.25)] md:block">
              {depot.gate}
            </div>
            {slip && <WarningSlip key={slip.key} slip={slip} strikes={strikes} onClose={() => setSlip(null)} />}

            <div className="mt-6 grid items-start gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {ALL.map((p, i) => (
                <DragOff key={p.name} locked={strikes >= depot.warnings.length} onPulled={onPulled} onBarredTry={onBarredTry}>
                  <Flyer p={p} i={i} />
                </DragOff>
              ))}
              <DragOff locked={strikes >= depot.warnings.length} onPulled={onPulled} onBarredTry={onBarredTry}>
                <SocietyFlyer />
              </DragOff>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- shared bits ---------- */

const TILT = ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1deg]", "rotate-[2.5deg]", "rotate-[-2.5deg]", "rotate-[1deg]"];
const PIN = ["bg-tomato", "bg-delhi", "bg-metro", "bg-[#3ee08f]", "bg-tomato", "bg-delhi"];

function Pin({ i }: { i: number }) {
  return (
    <span
      className={`absolute -top-2.5 left-1/2 z-20 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-ink ${PIN[i % PIN.length]} shadow-[2px_4px_0_rgba(0,0,0,.35)]`}
    />
  );
}

// Tear-off tabs: the links.
function Tabs({ links, dark }: { links: { label: string; href: string }[]; dark?: boolean }) {
  const n = 7;
  const tabs = Array.from({ length: n }, (_, k) => links[k % links.length]);
  return (
    <div className={`mt-4 flex border-t-2 border-dashed ${dark ? "border-white/40" : "border-ink/40"}`}>
      {tabs.map((l, k) => (
        <a
          key={k}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className={`tab-pull flex h-24 flex-1 items-center justify-center border-r border-dashed last:border-r-0 ${
            dark ? "border-white/40 hover:bg-white/10" : "border-ink/40 hover:bg-metro"
          }`}
          aria-label={`${l.label}: ${l.href}`}
          tabIndex={k < links.length ? 0 : -1}
        >
          <span className="rotate-180 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-wider [writing-mode:vertical-rl]">
            {l.label} ↗
          </span>
        </a>
      ))}
    </div>
  );
}

function Tags({ tags, dark }: { tags: string[]; dark?: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span key={t} className={`border px-1.5 py-0.5 font-mono text-[10px] uppercase ${dark ? "border-white/60" : "border-ink bg-white/70"}`}>
          {t}
        </span>
      ))}
    </div>
  );
}

function HomelabSticker() {
  return (
    <span className="absolute -right-3 top-10 z-10 rotate-[12deg] rounded-full border-2 border-ink bg-metro px-2.5 py-1 font-mono text-[9px] font-bold uppercase leading-tight text-ink shadow-[2px_2px_0_var(--color-ink)]">
      runs on
      <br />
      CommandHQ
    </span>
  );
}

/* ---------- the flyers ---------- */

function Flyer({ p, i }: { p: DepotProject; i: number }) {
  const wrap = `nb-flyer lift relative ${TILT[i % TILT.length]} shadow-[4px_6px_0_rgba(0,0,0,.3)]`;

  if (p.flyer === "learn")
    return (
      <article className={`${wrap} bg-delhi p-5 pb-0 text-paper`}>
        <Pin i={i} />
        <div className="font-marker text-4xl leading-[0.95]">{p.hook}</div>
        <div className="mt-3 inline-block bg-paper px-2 py-0.5 text-xl font-bold text-delhi">{p.name}</div>
        <p className="mt-2 font-hand text-2xl leading-tight">{p.oneLiner}</p>
        <p className="mt-2 text-sm text-paper/85">{p.detail}</p>
        <Tags tags={p.tags} dark />
        <Tabs links={p.links} dark />
      </article>
    );

  if (p.flyer === "warning")
    return (
      <article className={`${wrap} border-[6px] border-tomato bg-paper p-5 pb-0`}>
        <Pin i={i} />
        <div className="-mx-5 -mt-5 mb-3 bg-tomato py-1.5 text-center font-mono text-xs font-bold uppercase tracking-[0.4em] text-paper">⚠ Warning ⚠</div>
        <div className="font-marker text-4xl leading-none text-tomato">{p.hook}</div>
        <div className="mt-3 text-xl font-bold">{p.name}</div>
        <p className="mt-1 font-hand text-2xl leading-tight">{p.oneLiner}</p>
        <p className="mt-2 font-mono text-xs leading-relaxed text-ink/75">{p.detail}</p>
        <Tags tags={p.tags} />
        <Tabs links={p.links} />
      </article>
    );

  if (p.flyer === "warden")
    return (
      <article className={`${wrap} bg-ink p-5 pb-0 text-metro`}>
        <Pin i={i} />
        {p.homelab && <HomelabSticker />}
        <div className="font-marker text-4xl leading-[0.95]">{p.hook}</div>
        <div className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-paper/70">{p.name} will find you.</div>
        <p className="mt-3 font-hand text-2xl leading-tight text-paper">{p.oneLiner}</p>
        <p className="mt-2 text-sm text-paper/75">{p.detail}</p>
        <Tags tags={p.tags} dark />
        <Tabs links={p.links} dark />
      </article>
    );

  if (p.flyer === "nori")
    return (
      <article className={`${wrap} bg-[#bff0cf] p-5 pb-0`}>
        <Pin i={i} />
        {p.homelab && <HomelabSticker />}
        <div className="font-marker text-4xl leading-[0.95] text-[#14633f]">{p.hook}</div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white font-marker text-3xl text-[#14633f]">£</div>
          <div>
            <div className="text-xl font-bold">{p.name}</div>
            <p className="font-hand text-xl leading-tight">{p.oneLiner}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-ink/75">{p.detail}</p>
        <Tags tags={p.tags} />
        <Tabs links={p.links} />
      </article>
    );

  // "missing": lost-pet poster
  return (
    <article className={`${wrap} bg-white p-5 pb-0`}>
      <Pin i={i} />
      {p.homelab && <HomelabSticker />}
      <div className="text-center font-marker text-5xl leading-none">MISSING</div>
      <div className="text-center font-mono text-xs font-bold uppercase tracking-[0.3em] text-ink/60">one file · last seen: somewhere</div>
      {/* "photo" = a little treemap */}
      <div className="mx-auto mt-3 grid h-28 w-full grid-cols-6 grid-rows-4 gap-0.5 border-2 border-ink bg-ink p-0.5">
        <div className="col-span-3 row-span-4 bg-delhi" />
        <div className="col-span-2 row-span-2 bg-metro" />
        <div className="row-span-2 bg-tomato" />
        <div className="col-span-1 row-span-2 bg-[#3ee08f]" />
        <div className="col-span-2 row-span-1 bg-paper" />
        <div className="col-span-2 row-span-1 bg-[repeating-linear-gradient(45deg,#ddd_0_4px,#fff_4px_8px)]" />
      </div>
      <div className="mt-3 text-xl font-bold">
        {p.name} <span className="font-hand text-xl font-normal text-delhi">knows where it went.</span>
      </div>
      <p className="mt-1 font-hand text-xl leading-tight">{p.oneLiner}</p>
      <p className="mt-2 text-sm text-ink/75">{p.detail}</p>
      <Tags tags={p.tags} />
      <Tabs links={p.links} />
    </article>
  );
}

function SocietyFlyer() {
  const s = depot.society;
  return (
    <article className="nb-flyer lift relative rotate-[-1.5deg] bg-metro p-5 pb-0 shadow-[4px_6px_0_rgba(0,0,0,.3)]">
      <Pin i={2} />
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Join us!</div>
      <div className="mt-1 font-marker text-3xl leading-none">{s.name}</div>
      <p className="mt-3 font-hand text-2xl leading-tight">{s.meets}</p>
      <p className="mt-2 text-sm">{s.cta}. Tear off a tab.</p>
      <Tabs links={[{ label: "github", href: depot.github }]} />
    </article>
  );
}

/* ---------- easter egg: try to pull a flyer off the board ---------- */

// Mouse/pen only, so touch scrolling on phones is never hijacked. Tabs (links) still click normally.
function DragOff({ children, locked, onPulled, onBarredTry }: { children: ReactNode; locked: boolean; onPulled: () => void; onBarredTry: () => void }) {
  const el = useRef<HTMLDivElement>(null);
  const [pins, setPins] = useState(0);
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);

  const down = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("a")) return;
    e.preventDefault();
    if (locked) {
      gsap.fromTo(el.current, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1.2,0.25)" });
      onBarredTry();
      return;
    }
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    el.current?.setPointerCapture(e.pointerId);
    gsap.killTweensOf(el.current);
    gsap.to(el.current, { scale: 1.04, duration: 0.15 });
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    gsap.set(el.current, { x: dx, y: dy, rotation: dx * 0.04 });
  };
  const up = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    el.current?.releasePointerCapture(d.id);
    const dist = Math.hypot(e.clientX - d.x, e.clientY - d.y);
    gsap.to(el.current, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.9, ease: "elastic.out(1,0.45)" });
    if (dist > 40) {
      setPins((n) => n + 1);
      onPulled();
    }
  };

  return (
    <div
      ref={el}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="relative z-0 select-none active:z-30"
      style={{ cursor: locked ? "not-allowed" : "grab" }}
    >
      {children}
      {/* every attempt earns the flyer another pin */}
      {Array.from({ length: pins }, (_, k) => (
        <span
          key={k}
          className="extra-pin absolute z-30 h-5 w-5 rounded-full border-2 border-ink bg-tomato shadow-[2px_4px_0_rgba(0,0,0,.35)]"
          style={{ top: ["8%", "45%", "85%", "20%", "65%"][k % 5], [k % 2 ? "right" : "left"]: "6px" }}
        />
      ))}
    </div>
  );
}

function WarningSlip({ slip, strikes, onClose }: { slip: { title: string; text: string; barred?: boolean }; strikes: number; onClose: () => void }) {
  return (
    <div className="warning-slip pointer-events-none fixed left-1/2 top-20 z-[60] w-[min(26rem,88%)]" role="status" aria-live="polite">
      <div className={`relative border-[3px] border-ink bg-paper p-4 pt-5 shadow-[6px_6px_0_var(--color-ink)] ${slip.barred ? "rotate-[-2deg]" : "rotate-[1.5deg]"}`}>
        <span className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-ink bg-tomato" />
        <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-ink/40 pb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em]">
          <span className="text-tomato">Students&apos; Union · {slip.title}</span>
          <span className="text-ink/50">{"●".repeat(strikes)}{"○".repeat(Math.max(0, 3 - strikes))}</span>
        </div>
        <p className="mt-2 font-hand text-2xl leading-tight">{slip.text}</p>
        {slip.barred && (
          <div className="absolute -right-3 -top-4 rotate-[14deg] border-4 border-double border-tomato bg-paper/90 px-3 py-0.5 font-marker text-2xl text-tomato">
            BARRED
          </div>
        )}
        <button onClick={onClose} className="pointer-events-auto mt-2 font-mono text-[10px] uppercase tracking-widest text-ink/50 underline hover:text-ink">
          fine, I&apos;ll stop
        </button>
      </div>
    </div>
  );
}
