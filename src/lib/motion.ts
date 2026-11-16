import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Global cinematic scroll system: reveals, line masks, parallax, counters and gallery drift. */
export function useCinematicMotion(dependency: unknown = null) {
  useLayoutEffect(() => {
    if (prefersReduced()) {
      ScrollTrigger.refresh();
      return;
    }

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      reveals.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 30 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay: Number(el.dataset.revealDelay || 0),
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-lines]').forEach((group) => {
        const inners = group.querySelectorAll('[data-line-inner]');
        gsap.set(inners, { yPercent: 110 });
        gsap.to(inners, {
          yPercent: 0,
          duration: 0.95,
          stagger: 0.11,
          ease: 'power4.out',
          scrollTrigger: { trigger: group, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
        const target = Number(el.dataset.counter || 0);
        const suffix = el.dataset.suffix || '';
        const decimals = Number(el.dataset.decimals || 0);
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => {
            el.textContent = state.v.toFixed(decimals) + suffix;
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-rail]').forEach((rail) => {
        const distance = () => Math.max(0, Math.min(220, rail.scrollWidth - window.innerWidth + 64));
        gsap.to(rail, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: rail.parentElement || rail,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(timer);
      ctx.revert();
    };
  }, [dependency]);
}

/** Magnetic pointer motion for premium buttons (fine pointers only). */
export function attachMagnetic(el: HTMLElement | null) {
  if (!el || prefersReduced() || !window.matchMedia('(pointer: fine)').matches) return () => {};
  const inner = el.querySelector<HTMLElement>('.magnetic-inner') || el;
  const move = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.16;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.22;
    gsap.to(el, { x, y, duration: 0.45, ease: 'power3.out' });
    gsap.to(inner, { x: x * 0.45, y: y * 0.45, duration: 0.45, ease: 'power3.out' });
  };
  const leave = () => {
    gsap.to([el, inner], { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, .5)' });
  };
  el.addEventListener('mousemove', move);
  el.addEventListener('mouseleave', leave);
  return () => {
    el.removeEventListener('mousemove', move);
    el.removeEventListener('mouseleave', leave);
    gsap.set([el, inner], { x: 0, y: 0 });
  };
}
