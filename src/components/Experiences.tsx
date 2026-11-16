import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bus, Check, Clock3, Package, Route, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Button, Field, Line, SectionLabel } from './ui';
import { gsap, prefersReduced } from '../lib/motion';
import type { BookingRequest } from '../lib/types';

const today = new Date().toISOString().split('T')[0];

const sizePrice: Record<string, number> = {
  'Small (up to 5 lb)': 0, 'Medium (up to 20 lb)': 8, 'Large (up to 50 lb)': 18, 'Oversized': 36,
};
const typePrice: Record<string, number> = {
  'Documents': 0, 'Small Parcel': 4, 'Standard Box': 10, 'Fragile / Specialty': 22, 'Pallet / Freight': 55,
};
const speedPrice: Record<string, number> = {
  'Same-day': 0, 'Express (2 hours)': 26, 'Scheduled': -6, 'Next morning': 12,
};
const arrival: Record<string, string> = {
  'Same-day': 'Today by 6:30 PM', 'Express (2 hours)': 'Within 2 hours', 'Scheduled': 'On your selected date', 'Next morning': 'Tomorrow by 11:00 AM',
};

/* ------------------------------- COURIER ------------------------------- */
export function CourierExperience({ onBook }: { onBook: (req: BookingRequest) => void }) {
  const [form, setForm] = useState({
    pickup: '', dropoff: '', size: 'Medium (up to 20 lb)', type: 'Standard Box', speed: 'Same-day', date: today, time: '10:30',
  });
  const price = 24 + (sizePrice[form.size] ?? 0) + (typePrice[form.type] ?? 0) + (speedPrice[form.speed] ?? 0);
  const priceRef = useRef<HTMLSpanElement>(null);
  const previous = useRef(price);

  useEffect(() => {
    if (!priceRef.current) return;
    if (prefersReduced()) { priceRef.current.textContent = `$${price.toFixed(2)}`; previous.current = price; return; }
    const state = { v: previous.current };
    const tween = gsap.to(state, {
      v: price, duration: 0.6, ease: 'power2.out',
      onUpdate: () => { if (priceRef.current) priceRef.current.textContent = `$${state.v.toFixed(2)}`; },
    });
    previous.current = price;
    return () => { tween.kill(); };
  }, [price]);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <section id="courier" className="relative overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <div className="grain pointer-events-none absolute inset-0 opacity-60" />
      <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-frost/[.045] blur-[120px]" />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div className="lg:pt-5">
            <div data-reveal><SectionLabel dark>Courier Experience</SectionLabel></div>
            <h2 data-reveal className="mt-6 text-[clamp(2.5rem,4.6vw,4.4rem)] font-medium leading-[1.02] tracking-editorial">
              <span data-lines>
                <Line>Precision</Line>
                <Line>in every</Line>
                <Line><em className="display italic text-frost">delivery.</em></Line>
              </span>
            </h2>
            <p data-reveal className="mt-6 max-w-[430px] text-[14px] font-light leading-relaxed text-white/55">
              Build your delivery in seconds. Our live estimate responds to every detail, so you always know exactly what to expect before you book.
            </p>
            <div data-reveal className="mt-10 overflow-hidden rounded-[16px] border border-white/12">
              <img src="/images/packages.jpg" alt="Carefully arranged parcels inside a Northline delivery vehicle" className="h-[220px] w-full object-cover opacity-85 transition-transform duration-1000 hover:scale-105" />
            </div>
            <div data-reveal className="mt-6 flex items-center gap-7 text-[11px] font-medium uppercase tracking-[.1em] text-white/45">
              <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-frost" /> Insured handling</span>
              <span className="flex items-center gap-2"><Clock3 size={15} className="text-frost" /> Live tracking</span>
            </div>
          </div>

          <div data-reveal data-reveal-delay="0.1" className="scheme-dark rounded-[20px] border border-white/[.11] bg-white/[.035] p-5 backdrop-blur-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-frost"><Package size={17} strokeWidth={1.6} /></span>
                <div>
                  <p className="text-[14px] font-semibold tracking-tight text-paper">Schedule a delivery</p>
                  <p className="text-[11px] font-light text-white/45">All fields update your estimate instantly</p>
                </div>
              </div>
              <span className="label-micro hidden text-frost sm:block">Live estimate</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field dark label="Pickup Address" value={form.pickup} onChange={set('pickup')} placeholder="Street address or business" />
              <Field dark label="Drop-off Address" value={form.dropoff} onChange={set('dropoff')} placeholder="Street address or business" />
              <Field dark label="Package Size" value={form.size} onChange={set('size')} options={Object.keys(sizePrice)} />
              <Field dark label="Package Type" value={form.type} onChange={set('type')} options={Object.keys(typePrice)} />
              <Field dark label="Delivery Speed" value={form.speed} onChange={set('speed')} options={Object.keys(speedPrice)} />
              <Field dark label="Preferred Pickup Date" type="date" min={today} value={form.date} onChange={set('date')} />
              <Field dark label="Preferred Pickup Time" type="time" value={form.time} onChange={set('time')} className="sm:col-span-2" />
            </div>

            <div className="mt-6 grid gap-4 rounded-[14px] border border-frost/20 bg-gradient-to-br from-white/[.09] to-white/[.02] p-5 sm:grid-cols-2 sm:items-end">
              <div>
                <p className="label-micro text-frost">Estimated Delivery</p>
                <p className="mt-2 text-[44px] font-medium leading-none tracking-editorial text-paper">
                  <span ref={priceRef}>${price.toFixed(2)}</span>
                </p>
              </div>
              <div className="sm:text-right">
                <p className="label-micro text-white/40">Estimated Arrival</p>
                <p key={form.speed} className="animate-rise mt-2 text-[16px] font-medium text-paper">{arrival[form.speed]}</p>
                <p className="mt-1 text-[11px] font-light text-white/40">{form.type} · {form.size.split(' (')[0]}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] font-light text-white/40">Transparent pricing. No hidden fees.</p>
              <Button variant="primary" onClick={() => onBook({
                kind: 'courier', estimate: price,
                prefill: {
                  pickup: form.pickup, destination: form.dropoff, packageSize: form.size,
                  packageType: form.type, speed: form.speed, date: form.date, time: form.time,
                },
              })} className="w-full sm:w-auto">Book This Delivery</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- TOUR BUS ------------------------------ */
const coaches = [
  { name: 'Executive Coach', capacity: 'Up to 32 guests', price: 890, image: '/images/bus.jpg', features: ['Leather seating', 'Wi-Fi & power', 'Onboard refreshments'] },
  { name: 'Luxury Group Bus', capacity: 'Up to 48 guests', price: 1240, image: '/images/interior.jpg', features: ['Panoramic windows', 'Premium sound', 'Extra luggage space'] },
  { name: 'Private Charter', capacity: 'Up to 56 guests', price: 1680, image: '/images/group.jpg', features: ['Dedicated chauffeur', 'Custom itinerary', 'Event coordination'] },
];

export function TourBusExperience({ onBook }: { onBook: (req: BookingRequest) => void }) {
  const [selected, setSelected] = useState(0);
  const [form, setForm] = useState({
    passengers: '11–24 Passengers', tripType: 'One-way', pickup: '', destination: '',
    date: today, time: '09:00', returnDate: '', notes: '',
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <section id="tour-bus" className="relative overflow-hidden bg-glacier py-24 text-ink sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-start gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-14">
          <div>
            <div data-reveal className="relative h-[300px] overflow-hidden rounded-[16px] sm:h-[380px]">
              <img src="/images/interior.jpg" alt="Refined interior of a Northline executive coach" className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover" data-parallax />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 to-transparent" />
              <div className="absolute bottom-5 left-6 flex items-center gap-3 text-paper">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10"><Users size={15} /></span>
                <span className="text-[12px] font-medium tracking-wide">Comfort, considered in every detail</span>
              </div>
            </div>
            <div className="mt-10" data-reveal><SectionLabel>Tour Bus Experience</SectionLabel></div>
            <h2 data-reveal className="mt-5 text-[clamp(2.4rem,4.2vw,4rem)] font-medium leading-[1.04] tracking-editorial">
              <span data-lines>
                <Line>Travel together.</Line>
                <Line><em className="display italic text-ink/55">Arrive better.</em></Line>
              </span>
            </h2>
            <p data-reveal className="mt-5 max-w-[430px] text-[14px] font-light leading-relaxed text-ink/60">
              Corporate travel, celebrations, tours and private trips — shaped around your group, your timing and your standards.
            </p>
          </div>

          <div data-reveal data-reveal-delay="0.08" className="rounded-[20px] border border-ink/10 bg-paper p-5 shadow-[0_30px_80px_-50px_rgba(21,26,30,.5)] sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-glacier text-ink"><Bus size={17} strokeWidth={1.6} /></span>
                <div>
                  <p className="text-[14px] font-semibold tracking-tight">Plan your group trip</p>
                  <p className="text-[11px] font-light text-ink/45">A few details, then choose your coach</p>
                </div>
              </div>
              <span className="label-micro hidden text-ink/40 sm:block">Step 01 · Trip</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Passenger Count" value={form.passengers} onChange={set('passengers')} options={['1–10 Passengers', '11–24 Passengers', '25–40 Passengers', '41–56 Passengers']} />
              <Field label="Trip Type" value={form.tripType} onChange={set('tripType')} options={['One-way', 'Round trip', 'Multi-day tour', 'Hourly charter']} />
              <Field label="Pickup" value={form.pickup} onChange={set('pickup')} placeholder="Airport, hotel or address" />
              <Field label="Destination" value={form.destination} onChange={set('destination')} placeholder="Venue, city or address" />
              <Field label="Date" type="date" min={today} value={form.date} onChange={set('date')} />
              <Field label="Departure Time" type="time" value={form.time} onChange={set('time')} />
              <Field label="Return Date (optional)" type="date" min={today} value={form.returnDate} onChange={set('returnDate')} />
              <Field label="Special Requests" value={form.notes} onChange={set('notes')} placeholder="Stops, accessibility, amenities…" />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-6">
              <div>
                <p className="label-micro text-ink/40">Step 02 · Choose your coach</p>
                <p className="mt-1.5 text-[15px] font-medium tracking-tight">A vehicle for every occasion</p>
              </div>
              <Sparkles size={17} className="text-ink/35" />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {coaches.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                  className={`image-zoom group overflow-hidden rounded-[13px] border text-left transition-all duration-500 ${selected === i ? 'border-ink bg-white shadow-[0_18px_40px_-28px_rgba(21,26,30,.6)]' : 'border-ink/10 bg-white/60 hover:border-ink/35 hover:bg-white'}`}
                >
                  <div className="relative h-[105px] overflow-hidden">
                    <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                    <span className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-400 ${selected === i ? 'border-ink bg-ink text-paper' : 'border-white/60 bg-black/20 text-transparent'}`}>
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                  </div>
                  <div className="p-3.5">
                    <p className="text-[13px] font-semibold tracking-tight">{c.name}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[10px] text-ink/50"><Users size={11} /> {c.capacity}</p>
                    <ul className="mt-3 space-y-1.5">
                      {c.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-[10px] text-ink/55"><Check size={10} className="shrink-0 text-ink/45" /> {f}</li>
                      ))}
                    </ul>
                    <div className="mt-3.5 flex items-end justify-between border-t border-ink/8 pt-3">
                      <span className="text-[14px] font-semibold">${c.price.toLocaleString()}<span className="ml-1 text-[9px] font-medium text-ink/40">FROM</span></span>
                      <span className={`flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[.1em] transition-colors ${selected === i ? 'text-ink' : 'text-ink/35 group-hover:text-ink/70'}`}>
                        {selected === i ? 'Selected' : 'Select'} <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-[11px] font-light text-ink/50"><Route size={14} /> Professional chauffeur included</p>
              <Button variant="dark" onClick={() => onBook({
                kind: 'ride', vehicle: coaches[selected].name, estimate: coaches[selected].price,
                prefill: { ...form, destination: form.destination, pickup: form.pickup, passengers: form.passengers, tripType: form.tripType, notes: form.notes },
              })} className="w-full sm:w-auto">Reserve {coaches[selected].name}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
