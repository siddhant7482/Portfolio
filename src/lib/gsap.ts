"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  if (process.env.NODE_ENV !== "production") Object.assign(window, { ScrollTrigger, gsap });
}

export { gsap, ScrollTrigger, useGSAP };

// After a section (re)mounts, re-measure every trigger on the page. Pinned sections push everything
// below them down, so a section that mounts on its own (e.g. a hot reload) leaves stale positions otherwise.
let refreshQueued = false;
export function refreshSoon() {
  if (refreshQueued || typeof window === "undefined") return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    ScrollTrigger.refresh();
  });
}

type LenisLike = { scrollTo: (target: string | number, opts?: object) => void; stop: () => void; start: () => void };

export function getLenis(): LenisLike | undefined {
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

// Pause scrolling while a scene finishes its animation (counted, so scenes can nest).
// We swallow scroll input instead of calling lenis.stop(): stop() sets overflow:clip on <html>,
// which makes the scrollbar vanish and the page jump sideways.
let locks = 0;
const SCROLL_KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
const swallow = (e: Event) => {
  e.preventDefault();
  e.stopImmediatePropagation();
};
const swallowKey = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  if (SCROLL_KEYS.has(e.key)) swallow(e);
};
function setBlocking(on: boolean) {
  const fn = on ? window.addEventListener : window.removeEventListener;
  const opts = { capture: true, passive: false } as AddEventListenerOptions;
  fn.call(window, "wheel", swallow, opts);
  fn.call(window, "touchmove", swallow, opts);
  fn.call(window, "keydown", swallowKey as EventListener, opts);
}
export function lockScroll() {
  if (navigating) return; // a nav click always wins
  if (locks++ === 0) setBlocking(true);
}
export function unlockScroll() {
  if (!locks) return;
  locks = Math.max(0, locks - 1);
  if (!locks) setBlocking(false);
}

// True while a nav click is flying the page somewhere. Scenes we pass through
// shouldn't grab the scroll lock (they skip to their finished state instead).
let navigating = false;
let navTimer: number | undefined;
export const isNavigating = () => navigating;

// Scrolling this fast (px/s) means "passing through", not "watching".
export const PASSING_SPEED = 9000;

export function scrollToId(id: string) {
  const lenis = getLenis();
  navigating = true;
  window.clearTimeout(navTimer);
  const done = () => {
    navigating = false;
  };
  navTimer = window.setTimeout(done, 2500);
  // drop any scene's pause so the click always goes through
  if (locks) {
    locks = 0;
    setBlocking(false);
  }
  if (lenis) lenis.scrollTo(`#${id}`, { duration: 1.4, force: true, onComplete: done });
  else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
