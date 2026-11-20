"use client";
import { useRef } from "react";
import { gsap, useGSAP, refreshSoon } from "@/lib/gsap";
import { boardingPass, journey, type Station } from "@/lib/content";

const lineColor = { delhi: "bg-delhi", metro: "bg-metro", flight: "" } as const;

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      const st = { trigger: pin.current, start: "top top", end: () => "+=" + dist(), scrub: 1, invalidateOnRefresh: true };

      const move = gsap.to(t, { x: () => -dist(), ease: "none", scrollTrigger: { ...st, pin: true } });
      // notebook cream (carried over from the Origin page) → Delhi warm → Newcastle grey
      gsap
        .timeline({ scrollTrigger: { ...st, scrub: true } })
        .fromTo(pin.current, { backgroundColor: "#fdfbf4" }, { backgroundColor: "#f4e6c9", ease: "none", duration: 0.2 })
        .to(".j-lines", { opacity: 0, ease: "none", duration: 0.2 }, 0)
        .to(pin.current, { backgroundColor: "#dfe4ea", ease: "none", duration: 0.8 });

      // the heading slides in as the notebook page scrolls away
      gsap.from(".j-intro > *", {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: 0.8 },
      });
      gsap.to(".j-train", { left: "100%", ease: "none", scrollTrigger: { ...st, scrub: true } });

      gsap.utils.toArray<HTMLElement>(".j-card").forEach((el) => {
        gsap.from(el, {
          y: el.dataset.up === "1" ? -50 : 50,
          opacity: 0,
          rotate: el.dataset.up === "1" ? -5 : 5,
          duration: 0.6,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: el, containerAnimation: move, start: "left 85%", toggleActions: "play none none reverse" },
        });
      });
      gsap.fromTo(
        ".j-plane",
        { x: -120, y: 60, rotate: 20 },
        { x: 120, y: -40, rotate: -10, ease: "none", scrollTrigger: { trigger: ".j-flight", containerAnimation: move, start: "left right", end: "right left", scrub: true } },
      );
      refreshSoon();
    },
    { scope: root },
  );

  return (
    <section id="journey" ref={root}>
      <div ref={pin} className="relative h-[100svh] overflow-hidden bg-[#fdfbf4]">
        {/* the notebook's ruled lines carry on from the Origin page, then fade out */}
        <div className="j-lines pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(transparent_0_35px,#c4d4f2_35px_36px)]">
          <div className="absolute inset-y-0 left-20 hidden w-[2px] bg-tomato/60 sm:block" />
        </div>
        {/* overall progress line */}
        <div className="absolute inset-x-6 bottom-24 z-10 h-1 rounded bg-ink/10 sm:inset-x-12">
          <div className="j-train absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-paper" style={{ left: "0%" }} />
          <span className="absolute -top-6 left-0 font-mono text-[10px] font-bold">DEL</span>
          <span className="absolute -top-6 right-0 font-mono text-[10px] font-bold">NCL</span>
        </div>

        <div ref={track} className="flex h-full w-max items-center pl-[6vw] pr-[20vw] pt-10">
          {/* intro */}
          <div className="j-intro w-[85vw] shrink-0 pr-10 sm:w-[48vw]">
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-delhi">02 · The journey</div>
            <h2 className="font-marker text-5xl leading-[0.95] sm:text-7xl">
              The long
              <br />
              commute.
            </h2>
            <p className="mt-5 max-w-md font-hand text-2xl sm:text-3xl">
              From the <span className="bg-delhi px-1 text-paper">Blue Line</span> to the{" "}
              <span className="bg-metro px-1">Yellow Line</span>. Keep scrolling, we&apos;re moving →
            </p>
          </div>

          {journey.map((s, i) =>
            s.line === "flight" ? <Flight key={i} /> : <StationStop key={i} s={s} up={i % 2 === 0} />,
          )}

          <div className="w-[40vw] shrink-0 pl-10 font-hand text-3xl sm:w-[24vw]">
            ...and the train&apos;s still running.
          </div>
        </div>
      </div>
    </section>
  );
}

function StationStop({ s, up }: { s: Station; up: boolean }) {
  return (
    <div className="relative flex h-[70vh] w-[80vw] shrink-0 items-center sm:w-[34vw] lg:w-[28vw]">
      <div className={`absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 ${lineColor[s.line]}`} />
      <div className="absolute left-1/2 top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-ink bg-paper" />
      <div className={`absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-widest ${up ? "top-[calc(50%+24px)]" : "bottom-[calc(50%+24px)]"}`}>
        {s.place}
      </div>

      <div
        data-up={up ? "1" : "0"}
        className={`j-card absolute left-1/2 w-[72vw] -translate-x-1/2 border-2 border-ink bg-white p-4 hard-shadow sm:w-[30vw] lg:w-[24vw] ${
          up ? "bottom-[calc(50%+40px)]" : "top-[calc(50%+40px)]"
        } ${s.highlight ? "outline outline-4 outline-offset-4 outline-metro" : ""}`}
      >
        <div className="flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-ink/60">
          <span>{s.when}</span>
          <span className={`h-2.5 w-2.5 rounded-full ${s.line === "delhi" ? "bg-delhi" : "bg-metro"}`} />
        </div>
        <div className="mt-1 text-lg font-bold leading-tight">{s.title}</div>
        {s.role && <div className="font-hand text-xl leading-tight text-delhi">{s.role}</div>}
        <p className="mt-2 text-sm leading-snug text-ink/80">{s.body}</p>
      </div>
    </div>
  );
}

function Flight() {
  const b = boardingPass;
  return (
    <div className="j-flight relative flex h-[70vh] w-[90vw] shrink-0 items-center sm:w-[56vw] lg:w-[44vw]">
      <svg className="absolute inset-x-0 top-1/2 h-40 w-full -translate-y-1/2" viewBox="0 0 400 100" preserveAspectRatio="none">
        <path d="M0 50 Q 200 -40 400 50" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeDasharray="6 8" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="j-plane absolute left-1/2 top-[30%] -translate-x-1/2 text-6xl">✈</div>

      {/* boarding pass */}
      <div className="absolute left-1/2 top-[calc(50%+30px)] flex w-[86vw] -translate-x-1/2 rotate-[-2deg] border-2 border-ink bg-paper hard-shadow sm:w-[44vw] lg:w-[34vw]">
        <div className="flex-1 p-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">Boarding pass · one way</div>
          <div className="flex items-end justify-between">
            <div>
              <div className="font-marker text-4xl text-delhi">{b.from}</div>
              <div className="text-xs">{b.fromCity}</div>
            </div>
            <div className="pb-3 text-2xl">✈</div>
            <div className="text-right">
              <div className="font-marker text-4xl">{b.to}</div>
              <div className="text-xs">{b.toCity}</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px] uppercase">
            <div>
              <div className="text-ink/50">Passenger</div>
              <div className="font-bold">Sid</div>
            </div>
            <div>
              <div className="text-ink/50">Seat</div>
              <div className="font-bold normal-case">{b.seat}</div>
            </div>
            <div className="col-span-2">
              <div className="text-ink/50">Baggage</div>
              <div className="font-bold normal-case">{b.baggage}</div>
            </div>
          </div>
        </div>
        <div className="flex w-16 items-center justify-center border-l-2 border-dashed border-ink bg-metro">
          <span className="rotate-90 whitespace-nowrap font-mono text-xs font-bold tracking-widest">2025 · NO RETURN</span>
        </div>
      </div>
    </div>
  );
}
