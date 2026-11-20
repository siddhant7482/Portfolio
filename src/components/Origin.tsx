"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, lockScroll, unlockScroll, isNavigating, PASSING_SPEED, refreshSoon } from "@/lib/gsap";
import { origin } from "@/lib/content";

// The scene plays in 3 steps: 1 = power on + type, 2 = compile, 3 = run.
// Scrolling picks the step; each step always plays to the end (scroll pauses meanwhile).
const STEP_AT = [0, 0.18, 0.4];
const HINTS = ["", "scroll ↓ to compile", "scroll ↓ to run it"];
const L = origin.code.length;

export default function Origin() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const v = useRef({ power: 0, chars: 0, compile: 0, out: 0 });
  const [, redraw] = useReducer((x: number) => x + 1, 0);
  const [stage, setStage] = useState(0); // last step started
  const [done, setDone] = useState(0); // last step finished
  const [stamp, setStamp] = useState(false);

  // Easter egg: PC-07's power button. Each press, the teacher gets crosser.
  type Pc = { phase: "on" | "off" | "boot" | "confiscated"; presses: number; note: string | null; lines: string[] };
  const [pc, setPc] = useState<Pc>({ phase: "on", presses: 0, note: null, lines: [] });
  const pcTimers = useRef<number[]>([]);
  const later = (ms: number, fn: () => void) => pcTimers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => pcTimers.current.forEach(window.clearTimeout), []);
  const pressPower = () => {
    if (pc.phase === "off" || pc.phase === "boot") return; // let it finish dying first
    if (pc.phase === "confiscated") {
      setPc({ phase: "boot", presses: 0, note: origin.forgiven, lines: [origin.forgiven] });
      later(1900, () => setPc({ phase: "on", presses: 0, note: null, lines: [] }));
      return;
    }
    const presses = pc.presses + 1;
    const step = origin.power[presses - 1];
    setPc({ phase: "off", presses, note: step.note, lines: [] });
    if (presses >= origin.power.length) {
      later(1100, () => setPc({ phase: "confiscated", presses, note: step.note, lines: origin.confiscated }));
    } else {
      later(1100, () => setPc({ phase: "boot", presses, note: step.note, lines: step.boot }));
      later(2900, () => setPc((p) => ({ ...p, phase: "on", note: null, lines: [] })));
    }
  };

  // Shrink the whole scene to fit short/odd-shaped windows instead of clipping it.
  const fit = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = fit.current;
    if (!el) return;
    const calc = () => {
      const avail = window.innerHeight - 44 /* top bar */ - 80 /* nav */ - 70; /* stamp + notes poking out */
      setScale(Math.min(1, Math.max(0.55, avail / el.offsetHeight)));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    window.addEventListener("resize", calc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, []);

  useGSAP(
    (_ctx, contextSafe) => {
      let played = 0;
      let want = 0;
      let busy = false;

      const build = (n: number) => {
        const tl = gsap.timeline({ paused: true, onUpdate: redraw });
        if (n === 1)
          tl.to(v.current, { power: 1, duration: 0.8, ease: "power2.in" }).to(v.current, { chars: L, duration: 2.6, ease: "none" }, "+=0.25");
        if (n === 2) tl.to(v.current, { compile: 1, duration: 1.4, ease: "power1.inOut" }).to({}, { duration: 0.7 });
        if (n === 3)
          tl.to(v.current, { out: 3, duration: 1.2, ease: "steps(3)" })
            .call(() => setStamp(true), undefined, "+=0.4")
            .to({}, { duration: 0.6 });
        return tl;
      };

      let current: gsap.core.Timeline | null = null;
      let skipping = false;

      const next = contextSafe!(() => {
        if (busy || skipping || played >= want) return;
        busy = true;
        lockScroll();
        const n = ++played;
        setStage(n);
        current = build(n)
          .eventCallback("onComplete", () => {
            setDone(n);
            busy = false;
            current = null;
            unlockScroll();
            next();
          })
          .play();
      });

      // Visitor is flying past (nav click / very fast scroll): jump to the finished scene, no lock.
      const finishNow = contextSafe!(() => {
        if (played >= 3 && !busy) return;
        skipping = true;
        want = 3;
        current?.progress(1);
        Object.assign(v.current, { power: 1, chars: L, compile: 1, out: 3 });
        played = 3;
        setStage(3);
        setDone(3);
        setStamp(true);
        redraw();
        skipping = false;
      });

      ScrollTrigger.create({
        trigger: pin.current,
        pin: true,
        start: "top top",
        end: "+=120%",
        onUpdate: (s) => {
          if (isNavigating() || Math.abs(s.getVelocity()) > PASSING_SPEED) return finishNow();
          const w = STEP_AT.filter((t) => s.progress > t).length;
          if (w > want) {
            want = w;
            next();
          }
        },
      });

      // as the page scrolls away, the notebook contents drift up and fade so the Journey can take over
      gsap.to(".o-grid", {
        y: -90,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "bottom 85%", end: "bottom 20%", scrub: true },
      });

      refreshSoon();
      return () => {
        if (busy) unlockScroll();
      };
    },
    { scope: root },
  );

  const { power, compile: compileT, out } = v.current;
  const on = power > 0;
  const powerT = power;
  const booted = power >= 1;
  const chars = Math.round(v.current.chars);
  const running = out > 0;
  const compiling = compileT > 0 && !running;
  const hint = done === stage && stage > 0 && stage < 3 ? HINTS[stage] : "";

  const show = (visible: boolean) =>
    `transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`;

  return (
    <section id="origin" ref={root} className="text-ink">
      {/* the whole section is the exercise-book page */}
      <div
        ref={pin}
        className="relative flex h-[100svh] items-center justify-center overflow-hidden border-t-2 border-ink bg-[#fdfbf4] px-4 pb-20 pt-14 [background-image:repeating-linear-gradient(transparent_0_35px,#c4d4f2_35px_36px)] sm:pl-28 sm:pr-10"
      >
        {/* punch holes + red margin */}
        <div className="pointer-events-none absolute inset-y-0 left-20 hidden w-[2px] bg-tomato/60 sm:block" />
        <div className="pointer-events-none absolute inset-y-16 left-6 hidden flex-col justify-around sm:flex">
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className="h-6 w-6 rounded-full border-2 border-ink/25 bg-[#ebe4d3] shadow-[inset_2px_2px_0_rgba(0,0,0,.08)]" />
          ))}
        </div>
        {/* Date / Page box, like every school notebook */}
        <div className="absolute right-4 top-14 flex border-2 border-ink/60 bg-[#fdfbf4] font-hand text-lg text-ink/70 sm:right-10">
          <span className="border-r-2 border-ink/60 px-2">Date: ______</span>
          <span className="px-2">Page: 01</span>
        </div>

        <div
          ref={fit}
          className="relative mx-auto w-full max-w-6xl shrink-0"
          style={{ transform: `scale(${scale})`, transformOrigin: "50% 50%" }}
        >
          <div className="o-grid grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
          {/* ---- left: story ---- */}
          <div className="relative">
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-tomato">01 · Origin</div>
            <h2 className="relative inline-block font-marker text-5xl leading-none sm:text-6xl">
              How it <span className="text-delhi">started.</span>
              <svg className="absolute -bottom-3 left-0 h-4 w-full" viewBox="0 0 300 16" preserveAspectRatio="none">
                <path
                  d="M3 10 C 60 2, 120 14, 180 7 S 270 4, 297 9"
                  fill="none"
                  stroke="var(--color-metro)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={stage > 0 ? 0 : 1}
                  className="transition-[stroke-dashoffset] duration-1000"
                />
              </svg>
            </h2>

            <div className="mt-6 space-y-2 sm:space-y-3">
              {origin.notes.map((n, i) => (
                <p
                  key={n}
                  className={`font-hand text-xl leading-[36px] text-[#1f3fa8] sm:text-[1.7rem] ${show([on, chars > L * 0.5, out >= 2][i])}`}
                >
                  {i === 2 ? <span className="box-decoration-clone bg-metro/70 px-1">{n}</span> : n}
                </p>
              ))}
            </div>

            {/* lab rules poster */}
            <div className={`tape relative mt-7 hidden w-56 rotate-[-3deg] border-2 border-ink bg-white p-4 shadow-[4px_4px_0_var(--color-ink)] lg:block ${show(chars > 12)}`}>
              <div className="border-b-2 border-ink pb-1 text-center font-mono text-xs font-bold uppercase tracking-[0.25em]">Computer lab</div>
              <div className="mt-1 text-center font-mono text-[10px] uppercase tracking-widest text-ink/60">Rules</div>
              <ol className="mt-2 list-decimal space-y-0.5 pl-5 font-hand text-xl leading-tight">
                {origin.rules.map((r, i) => (
                  <li key={r} className={i === origin.rules.length - 1 ? "text-tomato" : ""}>
                    {r}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ---- right: the computer ---- */}
          <div className="relative mx-auto w-full max-w-[540px]">
            {/* sticky note on the monitor */}
            <div className={`absolute -right-2 -top-6 z-20 w-36 rotate-[7deg] bg-metro p-3 font-hand text-lg leading-tight text-ink shadow-[3px_3px_0_var(--color-ink)] sm:-right-8 sm:w-40 sm:text-xl ${show(booted)}`}>
              {origin.sticky}
            </div>

            {/* case */}
            <div className="relative rounded-[26px] border-4 border-ink bg-[#e3dac2] p-3 pb-9 shadow-[8px_8px_0_var(--color-ink)] sm:p-5 sm:pb-11">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] border-4 border-ink bg-black">
                <Screen
                  on={on}
                  powerT={powerT}
                  booted={booted}
                  chars={chars}
                  compiling={compiling}
                  compileT={compileT}
                  running={running}
                  out={out}
                />
                {/* power button easter egg: CRT switch-off, then reboot / confiscation */}
                {pc.phase === "off" && (
                  <div className="absolute inset-0 z-10 bg-black">
                    <div className="crt-off absolute inset-0 bg-white" />
                  </div>
                )}
                {(pc.phase === "boot" || pc.phase === "confiscated") && (
                  <div className="absolute inset-0 z-10 bg-black p-3 font-mono text-[11px] leading-relaxed text-[#c8c8c8] sm:p-5 sm:text-[15px]">
                    {pc.lines.map((l) => (
                      <div key={l}>{l}</div>
                    ))}
                    <span className="blink">_</span>
                  </div>
                )}
                {/* scanlines + glass */}
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.22)_0_1px,transparent_1px_3px)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_18%,rgba(255,255,255,.14),transparent_55%)]" />
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,.85)]" />
              </div>
              <div className="absolute bottom-2.5 left-5 font-mono text-[9px] tracking-[0.3em] text-[#6b6450] sm:bottom-3.5 sm:text-[10px]">SCHOOL LAB · PC-07</div>
              <div className="absolute bottom-3 right-5 flex items-center gap-2 sm:bottom-4">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-ink transition-all"
                  style={{ background: !on ? "#6b6450" : pc.phase === "on" || pc.phase === "boot" ? "#4ade80" : "#e5432f" }}
                />
                <button
                  onClick={pressPower}
                  aria-label="PC-07 power button"
                  title="Don't."
                  className="power-btn flex h-4 w-8 items-center justify-center rounded-sm border-2 border-ink/60 bg-[#d6ccb1] font-mono text-[9px] leading-none text-ink/60 transition-colors hover:bg-metro active:translate-y-px"
                >
                  ⏻
                </button>
              </div>
              {/* the teacher's note, taped over the screen */}
              {pc.note && (
                <div key={pc.note} className="teacher-note tape absolute left-1/2 top-[38%] z-20 w-[min(17rem,80%)] border-2 border-ink bg-white px-4 py-3 text-center font-hand text-2xl leading-tight text-tomato shadow-[4px_4px_0_var(--color-ink)]">
                  {pc.note}
                </div>
              )}
            </div>
            {/* stand */}
            <div className="mx-auto h-5 w-28 border-x-4 border-ink bg-[#d6ccb1]" />
            <div className="mx-auto h-4 w-52 rounded-t-lg border-4 border-b-0 border-ink bg-[#e3dac2]" />

            {/* what to do next */}
            <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-hand text-2xl text-delhi ${show(!!hint)}`}>
              <span className="inline-block animate-bounce">{hint || " "}</span>
            </div>

            {/* floppy */}
            <div className={`absolute -bottom-8 -left-24 hidden rotate-[-12deg] md:block ${show(stage >= 2)}`}>
              <div className="tape relative">
                <Floppy label={origin.floppy} />
              </div>
            </div>

            {/* teacher's red-pen correction */}
            <div className={`absolute -bottom-12 right-0 z-20 max-w-[16rem] rotate-[-4deg] font-hand text-xl leading-tight text-tomato sm:-right-6 sm:text-2xl ${show(out >= 3)}`}>
              ↑ {origin.outputNote}
            </div>

            {/* teacher's stamp */}
            <div
              className={`absolute bottom-24 left-2 z-20 rotate-[-8deg] border-4 border-double border-tomato bg-[#fdfbf4]/85 px-3 py-1.5 font-marker text-lg text-tomato transition-all duration-300 sm:-left-6 sm:bottom-auto sm:-top-10 sm:text-2xl ${
                stamp ? "scale-100 opacity-100" : "pointer-events-none scale-[2.5] opacity-0"
              }`}
            >
              {origin.stamp}
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- the CRT screen ---------------- */

function Screen(props: {
  on: boolean;
  powerT: number;
  booted: boolean;
  chars: number;
  compiling: boolean;
  compileT: number;
  running: boolean;
  out: number;
}) {
  const { on, powerT, booted, chars, compiling, compileT, running, out } = props;
  const txt = "text-[9px] leading-[1.45] sm:text-[12px] lg:text-[13px]";

  if (!on) return null;

  if (!booted) {
    // the classic CRT "line then flash" power-on
    const sx = Math.min(1, powerT * 2.2);
    const sy = powerT < 0.45 ? 0.006 : Math.min(1, (powerT - 0.45) * 2);
    return <div className="absolute inset-0 bg-white" style={{ transform: `scale(${sx}, ${sy})`, opacity: 1 - Math.max(0, powerT - 0.7) }} />;
  }

  if (running) {
    return (
      <div className={`absolute inset-0 bg-black p-3 font-mono text-[11px] leading-relaxed text-[#c8c8c8] sm:p-5 sm:text-[15px] lg:text-[17px]`}>
        {out >= 1 && <div>C:\TC\BIN&gt;FIRST.EXE</div>}
        {out >= 2 && <div className="text-white">{origin.output}</div>}
        {out >= 3 && (
          <div>
            C:\TC\BIN&gt;<span className="blink">_</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 flex flex-col bg-[#0000aa] font-mono text-[#ffff55] ${txt}`}>
      {/* menu bar */}
      <div className="flex gap-2.5 overflow-hidden whitespace-nowrap bg-[#aaaaaa] px-2 text-black sm:gap-4">
        <span>≡</span>
        {["File", "Edit", "Search", "Run", "Compile", "Debug", "Options", "Window", "Help"].map((m) => (
          <span key={m}>
            <span className="text-[#aa0000]">{m[0]}</span>
            {m.slice(1)}
          </span>
        ))}
      </div>
      {/* editor window */}
      <div className="relative mx-1 mb-1 mt-2 min-h-0 flex-1 border-[3px] border-double border-white">
        <div className="absolute -top-[0.8em] left-1/2 -translate-x-1/2 bg-[#0000aa] px-2 text-white">FIRST.CPP</div>
        <pre className="h-full overflow-hidden whitespace-pre-wrap px-2 pt-2 sm:px-3 sm:pt-3">
          <Code text={ORIGIN_CODE.slice(0, chars)} />
          {!compiling && <span className="blink bg-[#ffff55] text-[#ffff55]">_</span>}
        </pre>
      </div>
      {/* status bar */}
      <div className="overflow-hidden whitespace-nowrap bg-[#aaaaaa] px-2 text-black">
        <span className="text-[#aa0000]">F1</span> Help <span className="ml-2 text-[#aa0000]">F2</span> Save{" "}
        <span className="ml-2 text-[#aa0000]">Alt-F9</span> Compile <span className="ml-2 text-[#aa0000]">Ctrl-F9</span> Run
      </div>

      {/* compile dialog */}
      {compiling && (
        <div className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 border-4 border-double border-white bg-[#aaaaaa] p-2 text-black shadow-[8px_8px_0_#000] sm:p-3">
          <div className="mb-1 text-center font-bold text-white [text-shadow:1px_1px_0_#000]">═ Compiling ═</div>
          <div>Main file: FIRST.CPP</div>
          <div>Compiling: EDITOR → FIRST.CPP</div>
          <div className="mt-1 flex justify-between">
            <span>Lines: 8</span>
            <span>Warnings: 0</span>
            <span>Errors: 0</span>
          </div>
          <div className="mt-2 h-2.5 border border-black bg-white sm:h-3">
            <div className="h-full bg-[#00aa00]" style={{ width: `${compileT * 100}%` }} />
          </div>
          <div className={`mt-1.5 text-center font-bold ${compileT >= 1 ? "" : "invisible"}`}>
            Success : <span className="blink">Press any key</span>
          </div>
        </div>
      )}
    </div>
  );
}

const ORIGIN_CODE = origin.code;

// Turbo-style colouring: yellow code, light comments, white strings, cyan keywords.
function Code({ text }: { text: string }) {
  const parts = text.split(/(\/\/[^\n]*|"[^"\n]*"?|\b(?:int|return|include)\b)/g);
  return (
    <>
      {parts.map((s, i) => {
        if (!s) return null;
        if (s.startsWith("//")) return <span key={i} className="text-[#8a8aff]">{s}</span>;
        if (s.startsWith('"')) return <span key={i} className="text-white">{s}</span>;
        if (/^(int|return|include)$/.test(s)) return <span key={i} className="text-[#55ffff]">{s}</span>;
        return <span key={i}>{s}</span>;
      })}
    </>
  );
}

function Floppy({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 120 124" className="h-28 w-28 drop-shadow-[4px_4px_0_#000]" aria-hidden>
      <path d="M4 4 H100 L116 20 V120 H4 Z" fill="#2a2f3a" stroke="#000" strokeWidth="3" />
      <rect x="26" y="4" width="62" height="34" fill="#b9bec7" stroke="#000" strokeWidth="2" />
      <rect x="66" y="9" width="14" height="24" fill="#2a2f3a" />
      <rect x="16" y="56" width="88" height="58" fill="#f3eee4" stroke="#000" strokeWidth="2" />
      <line x1="22" y1="72" x2="98" y2="72" stroke="#2050d0" strokeWidth="1" />
      <line x1="22" y1="86" x2="98" y2="86" stroke="#2050d0" strokeWidth="1" />
      <line x1="22" y1="100" x2="98" y2="100" stroke="#2050d0" strokeWidth="1" />
      <text x="60" y="69" textAnchor="middle" fontSize="7.5" fontFamily="var(--nf-hand), cursive" fill="#e5432f">
        {label.split("|")[0]}
      </text>
      <text x="60" y="83" textAnchor="middle" fontSize="7.5" fontFamily="var(--nf-hand), cursive" fill="#141414">
        {label.split("|")[1] ?? ""}
      </text>
    </svg>
  );
}
