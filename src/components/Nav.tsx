import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { Button } from './ui';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Courier Services', href: '#courier' },
  { label: 'Tour Bus', href: '#tour-bus' },
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Contact', href: '#contact' },
];

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <a href="#home" className="group flex items-center gap-3" aria-label="Northline home">
      <span className={`relative flex h-9 w-9 items-center justify-center rounded-[9px] border ${light ? 'border-white/25 bg-white/[.06]' : 'border-ink/15 bg-ink/[.04]'}`}>
        <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 16.5 8.2 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9.6 16.5 14.8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".55" />
          <path d="M15.8 12.4 17 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".3" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block text-[15px] font-bold tracking-[.2em] ${light ? 'text-paper' : 'text-ink'}`}>NORTHLINE</span>
        <span className={`mt-[5px] block text-[8px] font-semibold tracking-[.34em] ${light ? 'text-white/45' : 'text-ink/45'}`}>MOBILITY GROUP</span>
      </span>
    </a>
  );
}

export default function Nav({ onBook }: { onBook: (kind: 'ride' | 'courier') => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-white/[.09] bg-ink/90 py-3 backdrop-blur-xl' : 'border-b border-transparent bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Logo />
          <nav className="hidden items-center gap-7 xl:flex" aria-label="Main navigation">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => { e.preventDefault(); go(l.href); }}
                className="group relative text-[11px] font-semibold uppercase tracking-[.12em] text-white/65 transition-colors duration-300 hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-frost transition-all duration-400 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-5 xl:flex">
            <a href="tel:+18005550142" className="text-[11px] font-semibold tracking-[.08em] text-white/55 transition-colors hover:text-white">
              +1 (800) 555-0142
            </a>
            <Button size="sm" variant="primary" onClick={() => onBook('ride')} className="!h-10 !px-5">
              Book Now
            </Button>
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[.05] text-paper transition-colors hover:bg-white/15 xl:hidden"
          >
            <Menu size={19} strokeWidth={1.6} />
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-[60] bg-ink transition-all duration-500 xl:hidden ${open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'}`}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'url(/images/road.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />
        <div className="relative flex h-full flex-col px-6 pb-9 pt-6 sm:px-9">
          <div className="flex items-center justify-between">
            <Logo />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-paper">
              <X size={19} strokeWidth={1.6} />
            </button>
          </div>
          <nav className="mt-12 flex flex-col" aria-label="Mobile navigation">
            {links.map((l, i) => (
              <button
                key={l.label}
                onClick={() => go(l.href)}
                style={{ transitionDelay: open ? `${i * 45 + 80}ms` : '0ms' }}
                className={`group flex items-center justify-between border-b border-white/10 py-4 text-left text-[27px] font-medium tracking-tight text-paper transition-all duration-500 sm:text-[32px] ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              >
                {l.label}
                <ArrowUpRight size={19} className="text-white/35 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            ))}
          </nav>
          <div className="mt-auto space-y-3 pt-8">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="primary" onClick={() => { setOpen(false); onBook('ride'); }} className="w-full">Book a Ride</Button>
              <Button variant="outline" onClick={() => { setOpen(false); onBook('courier'); }} className="w-full">Delivery</Button>
            </div>
            <a href="tel:+18005550142" className="flex items-center justify-center gap-2 pt-2 text-xs tracking-wide text-white/55">
              <Phone size={13} /> +1 (800) 555-0142 · Available 24/7
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
