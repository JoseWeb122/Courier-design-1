import { useEffect, useState } from 'react';
import {
  ArrowRight, Check, ChevronLeft, ChevronRight, CircleCheck, Clock3, MapPin,
  Package, RotateCw, Search, ShieldCheck, Star, Truck,
} from 'lucide-react';
import { Button, SectionLabel } from './ui';

/* ------------------------------ TRACKING ------------------------------- */
const stages = [
  { title: 'Order Received', detail: 'Delivery request confirmed', time: '08:12 AM' },
  { title: 'Pickup Confirmed', detail: 'Courier assigned to your pickup', time: '08:41 AM' },
  { title: 'In Transit', detail: 'Parcel moving between Northline hubs', time: '10:05 AM' },
  { title: 'Out for Delivery', detail: 'Final leg to the delivery address', time: 'Pending' },
  { title: 'Delivered', detail: 'Signature and photo confirmation', time: 'Pending' },
];

export function Tracking() {
  const [code, setCode] = useState('');
  const [activeCode, setActiveCode] = useState('');
  const [tracked, setTracked] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState(false);

  const runTrack = (value: string) => {
    const clean = value.trim().toUpperCase();
    if (!clean) { setError(true); return; }
    setError(false);
    setCode(clean);
    setActiveCode(clean);
    setTracked(true);
    setStage(0);
  };

  useEffect(() => {
    if (!tracked) return;
    const timers = [1, 2].map((n) => window.setTimeout(() => setStage(n), n * 420));
    return () => timers.forEach(window.clearTimeout);
  }, [tracked, activeCode]);

  const replay = () => {
    setStage(0);
    [1, 2].forEach((n) => window.setTimeout(() => setStage(n), n * 420));
  };

  return (
    <section id="track" className="relative overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-frost/[.05] blur-[130px]" />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
          <div>
            <div data-reveal><SectionLabel dark>Delivery Tracking</SectionLabel></div>
            <h2 data-reveal className="mt-6 text-[clamp(2.5rem,4.6vw,4.3rem)] font-medium leading-[1.04] tracking-editorial">
              <span data-lines>
                <span className="block overflow-hidden"><span data-line-inner className="block">Know where</span></span>
                <span className="block overflow-hidden"><span data-line-inner className="block">it is. <em className="display italic text-frost">Always.</em></span></span>
              </span>
            </h2>
            <p data-reveal className="mt-6 max-w-[400px] text-[14px] font-light leading-relaxed text-white/55">
              One reference number, complete visibility. Follow your delivery from the moment it is collected to the moment it arrives.
            </p>

            <div data-reveal className="mt-9 max-w-[440px]">
              <label className="label-micro text-white/45">Enter Tracking Number</label>
              <div className={`mt-3 flex items-center gap-2 rounded-full border p-1.5 transition-colors duration-400 ${error ? 'border-red-400/70' : 'border-white/18 focus-within:border-frost/70'} bg-white/[.045]`}>
                <Search size={17} className="ml-3 shrink-0 text-white/40" />
                <input
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') runTrack(code); }}
                  placeholder="TRK-28491"
                  className="input-reset show-placeholder-light h-10 !text-[13px] font-semibold tracking-[.12em] text-paper"
                />
                <Button variant="primary" size="sm" onClick={() => runTrack(code)} arrow={false} className="shrink-0">Track</Button>
              </div>
              {error ? (
                <p className="mt-2 pl-2 text-[11px] text-red-300/90">Enter a tracking number to continue.</p>
              ) : (
                <button onClick={() => runTrack('TRK-28491')} className="mt-3 flex items-center gap-2 pl-1 text-[11px] font-medium text-frost/80 underline underline-offset-4 transition-colors hover:text-frost">
                  Try sample number TRK-28491 <ArrowRight size={12} />
                </button>
              )}
            </div>

            <div data-reveal className="mt-12 flex items-center gap-3 border-t border-white/10 pt-6 text-[11px] font-light text-white/40">
              <ShieldCheck size={16} className="text-frost" /> Every delivery is monitored by our coordination team.
            </div>
          </div>

          <div data-reveal data-reveal-delay="0.1" className="glass-dark rounded-[20px] p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="label-micro text-white/40">{tracked ? 'Shipment status' : 'Awaiting tracking number'}</p>
                <p className="mt-2 text-[24px] font-medium tracking-tight text-paper">{tracked ? activeCode : '—'}</p>
              </div>
              <div className="flex items-center gap-2">
                {tracked && (
                  <button onClick={replay} aria-label="Refresh status" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                    <RotateCw size={14} />
                  </button>
                )}
                <span className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[.12em] ${tracked ? 'border-frost/35 bg-frost/10 text-frost' : 'border-white/15 text-white/40'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${tracked ? 'pulse-ring bg-frost' : 'bg-white/30'}`} />
                  {tracked ? 'Live' : 'Standby'}
                </span>
              </div>
            </div>

            {tracked ? (
              <div key={activeCode} className="animate-fade">
                <div className="grid grid-cols-2 gap-4 border-b border-white/10 py-5 sm:grid-cols-3">
                  <div><p className="label-micro text-white/35">Origin</p><p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium"><MapPin size={12} className="text-frost" /> Downtown Hub</p></div>
                  <div><p className="label-micro text-white/35">Destination</p><p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium"><MapPin size={12} className="text-frost" /> Midtown District</p></div>
                  <div className="col-span-2 sm:col-span-1"><p className="label-micro text-white/35">Estimated arrival</p><p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium"><Clock3 size={12} className="text-frost" /> Today, 6:30 PM</p></div>
                </div>

                <div className="relative mt-7 pl-1">
                  <div className="absolute bottom-5 left-[15px] top-3 w-px bg-white/12" />
                  <div
                    className="absolute left-[15px] top-3 w-px bg-gradient-to-b from-frost to-frost/30 transition-[height] duration-700 ease-out"
                    style={{ height: `calc(${(stage / (stages.length - 1)) * 100}% - ${stage === 0 ? 20 : 32}px)`, maxHeight: 'calc(100% - 40px)' }}
                  />
                  <div className="space-y-6">
                    {stages.map((s, i) => {
                      const done = i < stage;
                      const active = i === stage;
                      return (
                        <div key={s.title} className="relative flex items-start gap-4">
                          <span className={`relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border transition-all duration-600 ${done ? 'border-frost bg-frost text-ink' : active ? 'border-frost bg-ink text-frost pulse-ring' : 'border-white/15 bg-ink text-white/25'}`}>
                            {done ? <Check size={14} strokeWidth={2.4} /> : active ? <Truck size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                          </span>
                          <div className="flex flex-1 items-start justify-between gap-4 pt-1">
                            <div>
                              <p className={`text-[13px] font-medium transition-colors duration-500 ${done || active ? 'text-paper' : 'text-white/35'}`}>{s.title}</p>
                              <p className="mt-1 text-[11px] font-light text-white/40">{s.detail}</p>
                            </div>
                            <span className={`shrink-0 text-[10px] font-medium tracking-wide ${done || active ? 'text-frost/80' : 'text-white/25'}`}>{s.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                  <p className="flex items-center gap-2 text-[11px] font-light text-white/40"><CircleCheck size={14} className="text-frost" /> Updates refresh automatically</p>
                  <button onClick={() => { setTracked(false); setCode(''); setStage(0); }} className="text-[11px] font-semibold uppercase tracking-[.12em] text-frost transition-opacity hover:opacity-70">Track another</button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/12 bg-white/[.04] text-frost"><Package size={25} strokeWidth={1.3} /></span>
                <p className="mt-6 text-[17px] font-medium tracking-tight text-paper">Your delivery, in view</p>
                <p className="mt-2 max-w-[290px] text-[12px] font-light leading-relaxed text-white/40">
                  Enter your tracking number to reveal a live delivery timeline, current status and estimated arrival.
                </p>
                <div className="mt-8 flex w-full max-w-[280px] items-center gap-2">
                  {stages.map((s, i) => <span key={s.title} className={`h-1 flex-1 rounded-full ${i === 0 ? 'bg-frost/50' : 'bg-white/10'}`} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- TESTIMONIALS ----------------------------- */
const testimonials = [
  { quote: 'The coach arrived early, the cabin was immaculate, and our entire executive team traveled in complete comfort. It felt less like a transfer and more like part of the event.', name: 'Amelia Hart', role: 'Operations Director', service: 'Corporate Transportation', initials: 'AH' },
  { quote: 'We move time-sensitive documents across the city every week. Northline made the process effortless — precise pickup windows and updates at exactly the right moments.', name: 'Daniel Reeves', role: 'Managing Partner', service: 'Scheduled Courier', initials: 'DR' },
  { quote: 'Forty-two guests, three stops, one flawless day. The coordination before the trip was as impressive as the service on the road.', name: 'Sofia Marchetti', role: 'Event Producer', service: 'Private Charter', initials: 'SM' },
  { quote: 'Reliable, composed and genuinely easy to work with. Booking takes minutes and the team handles every detail from there.', name: 'Marcus Chen', role: 'Logistics Lead', service: 'Same-day Delivery', initials: 'MC' },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (dir: number) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 7500);
    return () => window.clearInterval(id);
  }, [paused, index]);

  return (
    <section id="testimonials" className="overflow-hidden bg-glacier py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div data-reveal><SectionLabel>Client Stories</SectionLabel></div>
            <h2 data-reveal className="mt-5 text-[clamp(2.4rem,4.4vw,4.1rem)] font-medium leading-[1.02] tracking-editorial">
              <span data-lines>
                <span className="block overflow-hidden"><span data-line-inner className="block">Words from</span></span>
                <span className="block overflow-hidden"><span data-line-inner className="block"><em className="display italic text-ink/55">the road.</em></span></span>
              </span>
            </h2>
          </div>
          <div data-reveal className="flex items-center gap-2">
            <button onClick={() => go(-1)} aria-label="Previous testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink hover:text-paper"><ChevronLeft size={17} /></button>
            <button onClick={() => go(1)} aria-label="Next testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink hover:text-paper"><ChevronRight size={17} /></button>
          </div>
        </div>

        <div className="mt-12 overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="flex transition-transform duration-[800ms] ease-[cubic-bezier(.22,1,.36,1)]" style={{ transform: `translateX(-${index * 100}%)` }}>
            {testimonials.map((t) => (
              <div key={t.name} className="w-full shrink-0 pr-0 md:pr-20">
                <div className="grid gap-8 border-t border-ink/15 pt-9 lg:grid-cols-[1fr_280px] lg:gap-16">
                  <div>
                    <div className="flex gap-1 text-ink/60">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill="currentColor" strokeWidth={1} />)}
                    </div>
                    <blockquote className="display mt-6 max-w-[900px] text-[clamp(1.6rem,3.1vw,3rem)] font-normal leading-[1.22] tracking-[-.02em] text-ink">
                      “{t.quote}”
                    </blockquote>
                  </div>
                  <div className="flex flex-row items-center gap-4 lg:flex-col lg:items-start lg:justify-end lg:border-l lg:border-ink/12 lg:pl-8">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-semibold tracking-wide text-paper">{t.initials}</span>
                    <div>
                      <p className="text-[14px] font-semibold tracking-tight">{t.name}</p>
                      <p className="mt-1 text-[11px] text-ink/50">{t.role}</p>
                      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-ink/12 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.1em] text-ink/55">{t.service}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-ink/12 pt-6">
          <div className="flex items-center gap-2">
            {testimonials.map((t, i) => (
              <button key={t.name} onClick={() => setIndex(i)} aria-label={`Show testimonial ${i + 1}`} className={`h-[3px] rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-ink' : 'w-4 bg-ink/20 hover:bg-ink/45'}`} />
            ))}
          </div>
          <span className="text-[11px] font-semibold tracking-[.14em] text-ink/40">{String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
}
