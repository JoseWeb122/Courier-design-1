import { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, CalendarCheck, Camera, Check, ChevronUp, Compass,
  Globe, Headphones, Mail, MapPin, Phone, Play, ShieldCheck,
  SlidersHorizontal, Sparkles, Users,
} from 'lucide-react';
import { Button, Line, SectionLabel } from './ui';
import { Logo } from './Nav';
import type { BookingRequest } from '../lib/types';

type BookFn = (req: BookingRequest) => void;

/* --------------------------- SERVICE SPLIT ----------------------------- */
const courierList = ['Local deliveries', 'Business deliveries', 'Scheduled delivery', 'Same-day delivery', 'Package transportation'];
const busList = ['Group transportation', 'Corporate transportation', 'Events', 'Tours', 'Private trips'];

export function ServiceSplit({ onBook }: { onBook: BookFn }) {
  return (
    <section id="services" className="bg-glacier py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div data-reveal><SectionLabel>Two Services · One Standard</SectionLabel></div>
            <h2 data-reveal className="mt-6 text-[clamp(2.6rem,5.3vw,5.2rem)] font-medium leading-[1] tracking-editorial">
              <span data-lines>
                <Line>Built to move</Line>
                <Line><em className="display italic text-ink/50">both ways.</em></Line>
              </span>
            </h2>
          </div>
          <p data-reveal className="max-w-[370px] text-[14px] font-light leading-relaxed text-ink/60 lg:pb-3">
            From a single parcel across town to fifty guests across the region — one team, one standard of care.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[18px] border border-ink/10 lg:grid-cols-2">
          {[
            { index: '01', label: 'Courier Services', image: '/images/courier.jpg', title: 'Every Delivery. Handled With Care.', items: courierList, cta: 'Book a Delivery', kind: 'courier' as const, accent: 'from-black/85 via-black/55 to-black/25' },
            { index: '02', label: 'Tour Bus', image: '/images/bus.jpg', title: 'Make the Journey Part of the Experience.', items: busList, cta: 'Book a Bus', kind: 'ride' as const, accent: 'from-black/85 via-black/55 to-black/25' },
          ].map((s) => (
            <div key={s.label} data-reveal className="image-zoom group relative isolate flex min-h-[560px] flex-col justify-between overflow-hidden border-b border-white/10 p-7 text-paper last:border-b-0 sm:min-h-[620px] sm:p-10 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <img src={s.image} alt={s.label} className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div className={`absolute inset-0 -z-10 bg-gradient-to-t ${s.accent}`} />
              <div className="absolute inset-0 -z-10 bg-ink/25 transition-opacity duration-700 group-hover:opacity-0" />
              <div className="flex items-start justify-between">
                <span className="label-micro text-frost">{s.index} / {s.label}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm transition-all duration-500 group-hover:rotate-45"><ArrowUpRight size={16} /></span>
              </div>
              <div>
                <h3 className="max-w-[440px] text-[clamp(2rem,3.1vw,3.15rem)] font-medium leading-[1.07] tracking-editorial">{s.title}</h3>
                <ul className="mt-8 grid max-w-[440px] grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 border-b border-white/12 pb-2.5 text-[12px] font-light text-white/80 transition-colors duration-400 group-hover:text-white">
                      <Check size={12} className="shrink-0 text-frost" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-9">
                  <Button variant="primary" onClick={() => onBook({ kind: s.kind })} className="min-w-[180px]">{s.cta}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- HOW IT WORKS ----------------------------- */
const process = [
  { n: '01', title: 'Choose Your Service', copy: 'Group transportation or a courier delivery — start with what you need to move.', icon: Compass },
  { n: '02', title: 'Customize Your Booking', copy: 'Set your route, timing, vehicle or package details. See clear pricing before you commit.', icon: SlidersHorizontal },
  { n: '03', title: 'Ride or Deliver With Confidence', copy: 'A professional team, a considered itinerary and support available around the clock.', icon: ShieldCheck },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative isolate overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <img src="/images/road.jpg" alt="" className="absolute inset-x-0 -top-[8%] -z-20 h-[116%] w-full object-cover opacity-35" data-parallax />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/80 to-ink" />
      <div className="grain absolute inset-0 -z-10" />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div data-reveal><SectionLabel dark>How It Works</SectionLabel></div>
            <h2 data-reveal className="mt-6 text-[clamp(2.6rem,5vw,5rem)] font-medium leading-[1] tracking-editorial">
              <span data-lines>
                <Line>Three steps.</Line>
                <Line><em className="display italic text-frost">Zero friction.</em></Line>
              </span>
            </h2>
          </div>
          <p data-reveal className="max-w-[340px] text-[13px] font-light leading-relaxed text-white/55 lg:pb-2">
            A booking experience designed to be as composed as the service that follows.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-0">
          {process.map((p, i) => (
            <div key={p.n} data-reveal data-reveal-delay={`${i * 0.11}`} className={`group relative lg:pr-10 lg:pl-10 lg:first:pl-0 ${i > 0 ? 'lg:border-l lg:border-white/12' : ''}`}>
              <div className="flex items-start justify-between">
                <span className="display text-[clamp(4.5rem,8vw,7.5rem)] leading-[.85] text-white/[.16] transition-colors duration-700 group-hover:text-frost/35">{p.n}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[.04] text-frost transition-colors duration-500 group-hover:bg-frost group-hover:text-ink"><p.icon size={18} strokeWidth={1.5} /></span>
              </div>
              <div className="mt-8 h-px w-full bg-white/12">
                <div className="h-px w-0 bg-gradient-to-r from-frost to-transparent transition-all duration-[900ms] group-hover:w-full" />
              </div>
              <h3 className="mt-7 max-w-[290px] text-[22px] font-medium leading-tight tracking-tight">{p.title}</h3>
              <p className="mt-3 max-w-[320px] text-[13px] font-light leading-relaxed text-white/50">{p.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- WHY CHOOSE US ---------------------------- */
const values = ['Reliable Scheduling', 'Professional Service', 'Simple Online Booking', 'Transparent Pricing', 'Customer-Focused Support'];
const stats = [
  { value: 10, suffix: '+', label: 'Years of Experience' },
  { value: 1000, suffix: '+', label: 'Trips & Deliveries' },
  { value: 24, suffix: '/7', label: 'Booking Access' },
  { value: 100, suffix: '%', label: 'Customer Focus' },
];

export function WhyChooseUs() {
  return (
    <section id="about" className="bg-paper py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <div data-reveal><SectionLabel>Why Northline</SectionLabel></div>
            <h2 data-reveal className="mt-6 text-[clamp(2.5rem,4.6vw,4.4rem)] font-medium leading-[1.03] tracking-editorial">
              <span data-lines>
                <Line>An uncommon</Line>
                <Line>standard of <em className="display italic text-ink/50">care.</em></Line>
              </span>
            </h2>
            <p data-reveal className="mt-6 max-w-[460px] text-[14px] font-light leading-relaxed text-ink/60">
              We are a mobility company built around a simple belief: the details are the experience. From the first confirmation to the final arrival, every step is considered.
            </p>
            <div className="mt-10">
              {values.map((v, i) => (
                <div key={v} data-reveal data-reveal-delay={`${i * 0.05}`} className="group flex items-center justify-between border-t border-ink/12 py-4 last:border-b">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-semibold tracking-[.14em] text-ink/35">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[15px] font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-1.5">{v}</span>
                  </div>
                  <ArrowUpRight size={15} className="text-ink/30 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                </div>
              ))}
            </div>
          </div>

          <div data-reveal data-reveal-delay="0.1" className="relative overflow-hidden rounded-[20px] bg-ink text-paper">
            <div className="grain absolute inset-0 opacity-50" />
            <div className="relative grid grid-cols-2">
              {stats.map((s, i) => (
                <div key={s.label} className={`p-7 sm:p-9 ${i % 2 === 0 ? 'border-r border-white/10' : ''} ${i < 2 ? 'border-b border-white/10' : ''}`}>
                  <span className="text-[clamp(2.3rem,4vw,3.8rem)] font-medium leading-none tracking-editorial text-paper">
                    <span data-counter={s.value} data-suffix={s.suffix}>0{s.suffix}</span>
                  </span>
                  <p className="mt-4 text-[11px] font-light leading-relaxed text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="relative h-[230px] overflow-hidden sm:h-[270px]">
              <img src="/images/driver.jpg" alt="Northline professional chauffeur beside an executive coach" className="h-full w-full object-cover object-[center_35%] opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
              <div className="absolute bottom-6 left-7 right-7 flex items-end justify-between gap-4">
                <p className="display max-w-[280px] text-[24px] leading-tight text-paper">Professional people behind every mile.</p>
                <BadgeCheck size={24} className="shrink-0 text-frost" strokeWidth={1.3} />
              </div>
            </div>
            <p className="relative px-7 pb-6 pt-4 text-[10px] font-light text-white/30">Figures shown are illustrative front-end content for this concept.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- GALLERY ------------------------------ */
const gallery = [
  { src: '/images/hero.jpg', title: 'Alpine Route', sub: 'Executive charter · 06:42', size: 'w-[330px] h-[420px] sm:w-[430px] sm:h-[500px]', offset: '' },
  { src: '/images/group.jpg', title: 'Arrival, Composed', sub: 'Group travel · Terminal 04', size: 'w-[280px] h-[320px] sm:w-[340px] sm:h-[390px]', offset: 'mt-10 sm:mt-16' },
  { src: '/images/packages.jpg', title: 'In Care', sub: 'Courier · Sorting', size: 'w-[300px] h-[380px] sm:w-[400px] sm:h-[450px]', offset: 'mt-4 sm:mt-6' },
  { src: '/images/interior.jpg', title: 'Quiet Cabin', sub: 'Luxury group bus · Interior', size: 'w-[320px] h-[300px] sm:w-[430px] sm:h-[370px]', offset: 'mt-14 sm:mt-24' },
  { src: '/images/city.jpg', title: 'City in Motion', sub: 'Urban transfer · Dusk', size: 'w-[300px] h-[400px] sm:w-[380px] sm:h-[480px]', offset: '' },
  { src: '/images/driver.jpg', title: 'The Team', sub: 'Professional chauffeurs', size: 'w-[260px] h-[340px] sm:w-[320px] sm:h-[400px]', offset: 'mt-10 sm:mt-16' },
  { src: '/images/road.jpg', title: 'Open Road', sub: 'Long-distance charter', size: 'w-[330px] h-[300px] sm:w-[430px] sm:h-[360px]', offset: 'mt-4 sm:mt-8' },
];

export function Gallery() {
  return (
    <section id="gallery" className="overflow-hidden bg-paper py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div data-reveal><SectionLabel>The Gallery</SectionLabel></div>
            <h2 data-reveal className="mt-5 text-[clamp(2.4rem,4.4vw,4.1rem)] font-medium leading-[1.02] tracking-editorial">
              <span data-lines>
                <Line>A life in <em className="display italic text-ink/50">motion.</em></Line>
              </span>
            </h2>
          </div>
          <p data-reveal className="flex items-center gap-2 pb-2 text-[11px] font-semibold uppercase tracking-[.12em] text-ink/40">Scroll to explore <ArrowRight size={14} /></p>
        </div>
      </div>
      <div className="relative mt-12 overflow-hidden">
        <div data-rail className="flex w-max gap-4 px-5 sm:gap-5 sm:px-8 lg:px-12">
          {gallery.map((g) => (
            <figure key={g.title} className={`image-zoom group relative shrink-0 overflow-hidden rounded-[12px] ${g.size} ${g.offset}`}>
              <img src={g.src} alt={g.title} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-paper">
                <div>
                  <p className="text-[17px] font-medium tracking-tight">{g.title}</p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[.12em] text-white/60">{g.sub}</p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 transition-all duration-500 group-hover:bg-paper group-hover:text-ink"><ArrowUpRight size={14} /></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FINAL CTA ----------------------------- */
export function FinalCTA({ onBook }: { onBook: BookFn }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-28 text-paper sm:py-36">
      <img src="/images/road.jpg" alt="" className="absolute inset-x-0 -top-[8%] -z-20 h-[116%] w-full object-cover object-center opacity-40" data-parallax />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/45" />
      <div className="grain absolute inset-0 -z-10" />
      <div className="relative mx-auto max-w-[1440px] px-5 text-center sm:px-8 lg:px-12">
        <div data-reveal className="flex justify-center"><SectionLabel dark>Your Next Move</SectionLabel></div>
        <h2 data-reveal className="mx-auto mt-7 max-w-[1000px] text-[clamp(2.7rem,6vw,6rem)] font-medium leading-[1.02] tracking-editorial">
          <span data-lines>
            <Line>Wherever You're Going,</Line>
            <Line><em className="display italic text-frost">Whatever You're Moving.</em></Line>
          </span>
        </h2>
        <p data-reveal className="mx-auto mt-7 max-w-[500px] text-[14px] font-light leading-relaxed text-white/65 sm:text-[15px]">
          Book transportation or schedule your next delivery in just a few clicks.
        </p>
        <div data-reveal className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="lg" onClick={() => onBook({ kind: 'ride' })} className="w-full min-w-[190px] sm:w-auto">Book a Ride</Button>
          <Button variant="outline" size="lg" onClick={() => onBook({ kind: 'courier' })} className="w-full min-w-[220px] sm:w-auto">Schedule a Delivery</Button>
        </div>
        <p data-reveal className="mt-12 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-white/35">
          <Sparkles size={13} className="text-frost" /> 24/7 booking access · Nationwide charter coordination
        </p>
      </div>
    </section>
  );
}

/* -------------------------------- FOOTER ------------------------------ */
const footerCols = [
  { title: 'Company', items: [{ label: 'About Northline', href: '#about' }, { label: 'How It Works', href: '#how-it-works' }, { label: 'Client Stories', href: '#testimonials' }, { label: 'Gallery', href: '#gallery' }] },
  { title: 'Services', items: [{ label: 'Courier Services', href: '#courier' }, { label: 'Tour Bus', href: '#tour-bus' }, { label: 'Group Transportation', href: '#services' }, { label: 'Same-day Delivery', href: '#courier' }] },
  { title: 'Booking', items: [{ label: 'Book a Ride', href: '#home' }, { label: 'Schedule a Delivery', href: '#courier' }, { label: 'Check Availability', href: '#tour-bus' }, { label: 'Delivery Estimate', href: '#courier' }] },
  { title: 'Support', items: [{ label: 'Track Delivery', href: '#track' }, { label: 'Contact Us', href: '#contact' }, { label: 'Service Area', href: '#contact' }, { label: 'FAQ', href: '#how-it-works' }] },
  { title: 'Contact', items: [{ label: '+1 (800) 555-0142', href: 'tel:+18005550142' }, { label: 'hello@northline.co', href: 'mailto:hello@northline.co' }, { label: 'Metro & nationwide', href: '#contact' }, { label: '24/7 availability', href: '#contact' }] },
];

export function Footer({ onBook }: { onBook: BookFn }) {
  const [note, setNote] = useState(false);
  return (
    <footer id="contact" className="border-t border-white/10 bg-[#101418] text-paper">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_2.65fr] lg:gap-16">
          <div>
            <Logo />
            <p className="mt-6 max-w-[300px] text-[13px] font-light leading-relaxed text-white/45">
              Premium group transportation and considered courier solutions, designed around the way you move.
            </p>
            <div className="mt-7 space-y-3 text-[12px] text-white/60">
              <a href="tel:+18005550142" className="flex items-center gap-3 transition-colors hover:text-frost"><Phone size={14} className="text-frost" /> +1 (800) 555-0142</a>
              <a href="mailto:hello@northline.co" className="flex items-center gap-3 transition-colors hover:text-frost"><Mail size={14} className="text-frost" /> hello@northline.co</a>
              <p className="flex items-center gap-3"><MapPin size={14} className="text-frost" /> Metro region & nationwide charters</p>
            </div>
            <div className="mt-8 flex items-center gap-2">
              {[
                { icon: Camera, label: 'Instagram', href: 'https://www.instagram.com/' },
                { icon: Globe, label: 'LinkedIn', href: 'https://www.linkedin.com/' },
                { icon: Users, label: 'Facebook', href: 'https://www.facebook.com/' },
                { icon: Play, label: 'YouTube', href: 'https://www.youtube.com/' },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/50 transition-all duration-400 hover:border-frost/50 hover:bg-white/5 hover:text-frost">
                  <s.icon size={15} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-5">
            {footerCols.map((col) => (
              <div key={col.title}>
                <p className="label-micro text-frost">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} onClick={(e) => {
                        if (item.label === 'Book a Ride' || item.label === 'Check Availability') { e.preventDefault(); onBook({ kind: 'ride' }); return; }
                        if (item.label === 'Schedule a Delivery' || item.label === 'Delivery Estimate') { e.preventDefault(); onBook({ kind: 'courier' }); return; }
                        if (!item.href.startsWith('#')) return;
                        e.preventDefault();
                        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }} className="group inline-flex items-center gap-1.5 text-[12px] font-light text-white/55 transition-colors hover:text-white">
                        {item.label}<ArrowUpRight size={11} className="opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
          <div className="flex items-center gap-3 text-[11px] text-white/40"><CalendarCheck size={15} className="text-frost" /> Mon–Sun · 24-hour booking</div>
          <div className="flex items-center gap-3 text-[11px] text-white/40 sm:justify-center"><Headphones size={15} className="text-frost" /> Dedicated coordination team</div>
          <div className="flex items-center gap-3 text-[11px] text-white/40 sm:justify-end"><ShieldCheck size={15} className="text-frost" /> Professional, insured service</div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-light text-white/35">© {new Date().getFullYear()} Northline Mobility Group. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <button onClick={() => setNote((n) => !n)} className="text-[11px] font-light text-white/35 underline underline-offset-4 transition-colors hover:text-white">Concept notice</button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.12em] text-white/55 transition-colors hover:text-frost">
              Back to top <ChevronUp size={13} />
            </button>
          </div>
        </div>
        {note && (
          <p className="animate-rise mt-4 rounded-[10px] border border-white/10 bg-white/[.03] p-4 text-[11px] leading-relaxed text-white/45">
            This website is a front-end design concept. Booking, payment and tracking interactions are simulated with mock data — no reservations, charges or deliveries are actually created.
          </p>
        )}
      </div>
    </footer>
  );
}
