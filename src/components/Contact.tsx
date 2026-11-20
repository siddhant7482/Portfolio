"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { contact, site } from "@/lib/content";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 60%" } });
      tl.from(".c-kick", { y: 30, opacity: 0 })
        .from(".c-big", { yPercent: 100, rotate: 6, duration: 0.9, ease: "back.out(1.6)" }, "-=0.2")
        .from(".c-rest > *", { y: 30, opacity: 0, stagger: 0.1 }, "-=0.4");
    },
    { scope: root },
  );

  return (
    <section id="contact" ref={root} className="bg-night text-paper">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-12">
        <div className="c-kick font-hand text-4xl text-paper/70 sm:text-5xl">{contact.kicker}</div>
        <div className="overflow-hidden">
          <div className="c-big font-marker text-[28vw] leading-[0.9] text-metro sm:text-[18vw] lg:text-[14rem]">{contact.big}</div>
        </div>
        <div className="c-rest mt-6 grid gap-10 md:grid-cols-2">
          <p className="max-w-md text-lg text-paper/80">{contact.body}</p>
          <div className="flex flex-wrap content-start gap-3 md:justify-end">
            {site.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="border-2 border-paper px-5 py-3 font-mono text-sm uppercase tracking-widest transition-colors hover:border-metro hover:bg-metro hover:text-ink"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-paper text-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-4 pb-28 pt-10 sm:px-12">
          <div>
            <div className="text-sm">{contact.footer}</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink/50">© 2026 {site.fullName}</div>
          </div>
          <div className="text-right font-marker text-3xl leading-none sm:text-4xl">
            {site.fullName}
            <div className="font-hand text-3xl text-delhi">(Sid)</div>
          </div>
        </div>
      </footer>
    </section>
  );
}
