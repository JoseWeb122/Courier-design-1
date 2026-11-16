import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft, BadgeCheck, Bus, Check, CheckCircle2, CreditCard, Download,
  Lock, Mail, MapPin, Package, Phone, ShieldCheck, Sparkles, X,
} from 'lucide-react';
import { Button, Field, SectionLabel, Steps } from './ui';
import { gsap, prefersReduced } from '../lib/motion';
import type { BookingRequest } from '../lib/types';

const money = (n: number) => `$${n.toFixed(2)}`;
const today = new Date().toISOString().split('T')[0];

type Form = Record<string, string>;

const initialForm: Form = {
  pickup: '', destination: '', date: today, time: '09:00',
  passengers: '11–24 Passengers', tripType: 'One-way',
  packageType: 'Standard Box', packageSize: 'Medium (up to 20 lb)', speed: 'Same-day',
  firstName: '', lastName: '', email: '', phone: '', company: '', notes: '',
  card: '', expiry: '', cvv: '', zip: '', cardName: '',
};

const stepLabels = (kind: 'ride' | 'courier') =>
  kind === 'ride'
    ? ['Trip Details', 'Passenger Details', 'Ride Summary', 'Payment']
    : ['Delivery Details', 'Contact Details', 'Delivery Summary', 'Payment'];

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-ink/[.08] py-3 last:border-0">
      <span className="text-[11px] font-semibold uppercase tracking-[.12em] text-ink/45">{label}</span>
      <span className="max-w-[62%] text-right text-[13px] font-medium text-ink">{value || '—'}</span>
    </div>
  );
}

function PaymentField({ label, value, onChange, error, placeholder, maxLength, className = '' }: {
  label: string; value: string; onChange: (v: string) => void; error?: boolean; placeholder?: string; maxLength?: number; className?: string;
}) {
  return (
    <div className={className}>
      <div className={`field-shell rounded-[10px] border bg-white px-[14px] py-[9px] ${error ? '!border-red-400 !bg-red-50' : 'border-ink/[.12] focus-within:border-ink/45'}`}>
        <span className="label-micro block !text-[9px] text-ink/40">{label}</span>
        <input
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-reset show-placeholder-dark mt-1.5 !h-auto text-[14px] font-medium tracking-[.06em] text-ink"
        />
      </div>
    </div>
  );
}

export default function BookingModal({ request, onClose, onTrack }: { request: BookingRequest; onClose: () => void; onTrack: () => void }) {
  const isRide = request.kind === 'ride';
  const [form, setForm] = useState<Form>({ ...initialForm, ...(request.prefill || {}) });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [direction, setDirection] = useState(1);
  const panel = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const confirmation = useMemo(() => `NL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, []);

  const base = request.estimate ?? (isRide ? 890 : 42);
  const serviceFee = isRide ? 65 : 8;
  const tax = Math.round(base * 0.085 * 100) / 100;
  const total = base + serviceFee + tax;
  const vehicle = request.vehicle || 'Executive Coach';
  const steps = stepLabels(request.kind);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.booking-panel', { opacity: 0, y: 32, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' });
    }, panel);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (prefersReduced() || !content.current) return;
    gsap.fromTo(content.current, { opacity: 0, x: direction * 22 }, { opacity: 1, x: 0, duration: 0.48, ease: 'power3.out' });
  }, [step, confirmed, direction]);

  const set = (key: string) => (v: string) => {
    setForm((f) => ({ ...f, [key]: v }));
    setErrors((e) => e.filter((k) => k !== key));
  };

  const formattedCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  const formattedExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validate = () => {
    let required: string[] = [];
    if (step === 0) required = ['pickup', 'destination', 'date', 'time'];
    if (step === 1) required = ['firstName', 'lastName', 'email', 'phone'];
    if (step === 3) {
      required = ['cardName', 'card', 'expiry', 'cvv', 'zip'];
      if (form.card.replace(/\s/g, '').length < 16) required.push('card');
      if (form.cvv.replace(/\D/g, '').length < 3) required.push('cvv');
      if (form.expiry.length < 5) required.push('expiry');
    }
    const unique = Array.from(new Set(required));
    const missing = unique.filter((k) => !form[k] || (step === 3 && ((k === 'card' && form.card.replace(/\s/g, '').length < 16) || (k === 'cvv' && form.cvv.replace(/\D/g, '').length < 3) || (k === 'expiry' && form.expiry.length < 5))));
    setErrors(missing);
    return missing.length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setDirection(1);
    if (step < 3) setStep((s) => s + 1);
  };
  const back = () => {
    setDirection(-1);
    setErrors([]);
    if (step > 0) setStep((s) => s - 1);
  };

  const pay = () => {
    if (!validate()) return;
    setProcessing(true);
    window.setTimeout(() => {
      setProcessing(false);
      setDirection(1);
      setConfirmed(true);
    }, 1100);
  };

  const downloadItinerary = () => {
    const lines = [
      'NORTHLINE MOBILITY GROUP — BOOKING ITINERARY',
      `Confirmation: ${confirmation}`,
      `Service: ${isRide ? 'Tour Bus / Group Transportation' : 'Courier Delivery'}`,
      `Route: ${form.pickup} → ${form.destination}`,
      `Date: ${form.date} at ${form.time}`,
      isRide ? `Vehicle: ${vehicle} · ${form.passengers}` : `Package: ${form.packageType} · ${form.speed}`,
      `Contact: ${form.firstName} ${form.lastName} · ${form.email}`,
      `Total: ${money(total)}`,
      '',
      'This is a demonstration itinerary. No payment was processed.',
    ];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `northline-${confirmation}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const title: ReactNode = isRide ? 'Design your journey.' : 'Arrange your delivery.';
  const subtitle = isRide
    ? 'Every detail considered. Tell us where you are going and we will take care of the rest.'
    : 'From pickup to doorstep, handled with precision and care.';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/75 p-0 backdrop-blur-md sm:p-5" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={panel} className="booking-panel relative flex min-h-[100svh] w-full max-w-[1200px] flex-col overflow-hidden bg-paper shadow-[0_50px_140px_-40px_rgba(0,0,0,.9)] sm:min-h-0 sm:h-[min(90vh,840px)] sm:rounded-[20px] lg:flex-row">
        {/* Cinematic side */}
        <div className="relative hidden w-[39%] shrink-0 overflow-hidden bg-ink lg:block">
          <img src={isRide ? '/images/bus.jpg' : '/images/courier.jpg'} alt="" className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50" />
          <div className="grain absolute inset-0" />
          <div className="absolute inset-0 flex flex-col justify-between p-9">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5">
                {isRide ? <Bus size={17} strokeWidth={1.6} /> : <Package size={17} strokeWidth={1.6} />}
              </span>
              <span className="text-[14px] font-bold tracking-[.22em] text-paper">NORTHLINE</span>
            </div>
            <div>
              <span className="label-micro text-frost">{isRide ? 'Group Transportation' : 'Courier Services'}</span>
              <h3 className="mt-4 text-[40px] font-medium leading-[1.04] tracking-editorial text-paper">
                {isRide ? <>The journey, <em className="display italic text-frost">elevated.</em></> : <>Every parcel, <em className="display italic text-frost">accounted for.</em></>}
              </h3>
              <p className="mt-5 max-w-[280px] text-[13px] font-light leading-relaxed text-white/60">
                Professional chauffeurs, considered logistics, and a dedicated team available around the clock.
              </p>
              <div className="mt-9 flex items-center gap-3 border-t border-white/15 pt-6 text-[11px] text-white/60">
                <ShieldCheck size={16} className="text-frost" /> Trusted by teams moving with purpose
              </div>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-ink/[.09] px-5 py-4 sm:px-9">
            <div className="flex items-center gap-3 lg:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-paper">{isRide ? <Bus size={15} /> : <Package size={15} />}</span>
              <span className="text-[12px] font-bold tracking-[.18em] text-ink">NORTHLINE</span>
            </div>
            <span className="label-micro hidden text-ink/45 lg:block">Secure Booking · {isRide ? 'Tour Bus' : 'Courier'}</span>
            <button onClick={onClose} aria-label="Close booking" className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 text-ink/60 transition-colors hover:bg-ink hover:text-paper">
              <X size={17} strokeWidth={1.7} />
            </button>
          </div>

          {!confirmed ? (
            <>
              <div className="border-b border-ink/[.08] px-5 py-5 sm:px-9">
                <Steps steps={steps} current={step} />
              </div>
              <div ref={content} className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-9 sm:py-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <SectionLabel>{`Step ${String(step + 1).padStart(2, '0')} / 04`}</SectionLabel>
                    <h2 className="mt-3 text-[28px] font-medium leading-tight tracking-editorial text-ink sm:text-[34px]">
                      {step === 0 && title}
                      {step === 1 && (isRide ? 'Who is traveling?' : 'How can we reach you?')}
                      {step === 2 && 'Review your details.'}
                      {step === 3 && 'Complete your booking.'}
                    </h2>
                    <p className="mt-2 max-w-[440px] text-[12px] font-light leading-relaxed text-ink/55">
                      {step === 0 ? subtitle : step === 1 ? 'A confirmation and itinerary will be sent to your email.' : step === 2 ? 'Everything look right? You can still make changes before payment.' : 'This is a front-end demonstration. No card will be charged.'}
                    </p>
                  </div>
                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-glacier text-ink sm:flex">
                    {step === 3 ? <CreditCard size={17} strokeWidth={1.6} /> : step === 2 ? <BadgeCheck size={17} strokeWidth={1.6} /> : isRide ? <Bus size={17} strokeWidth={1.6} /> : <Package size={17} strokeWidth={1.6} />}
                  </div>
                </div>

                {step === 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label={isRide ? 'Pickup Location' : 'Pickup Address'} value={form.pickup} onChange={set('pickup')} error={errors.includes('pickup')} placeholder="Street, city or airport" className="sm:col-span-2" />
                    <Field label={isRide ? 'Destination' : 'Delivery Address'} value={form.destination} onChange={set('destination')} error={errors.includes('destination')} placeholder="Street, city or venue" className="sm:col-span-2" />
                    {isRide ? (
                      <>
                        <Field label="Trip Type" value={form.tripType} onChange={set('tripType')} options={['One-way', 'Round trip', 'Multi-day charter', 'Hourly charter']} />
                        <Field label="Passengers" value={form.passengers} onChange={set('passengers')} options={['1–10 Passengers', '11–24 Passengers', '25–40 Passengers', '41–56 Passengers']} />
                      </>
                    ) : (
                      <>
                        <Field label="Package Type" value={form.packageType} onChange={set('packageType')} options={['Documents', 'Small Parcel', 'Standard Box', 'Fragile / Specialty', 'Pallet / Freight']} />
                        <Field label="Package Size" value={form.packageSize} onChange={set('packageSize')} options={['Small (up to 5 lb)', 'Medium (up to 20 lb)', 'Large (up to 50 lb)', 'Oversized']} />
                        <Field label="Delivery Speed" value={form.speed} onChange={set('speed')} options={['Same-day', 'Express (2 hours)', 'Scheduled', 'Next morning']} className="sm:col-span-2" />
                      </>
                    )}
                    <Field label={isRide ? 'Departure Date' : 'Preferred Pickup Date'} type="date" min={today} value={form.date} onChange={set('date')} error={errors.includes('date')} />
                    <Field label={isRide ? 'Departure Time' : 'Preferred Pickup Time'} type="time" value={form.time} onChange={set('time')} error={errors.includes('time')} />
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="First Name" value={form.firstName} onChange={set('firstName')} error={errors.includes('firstName')} />
                    <Field label="Last Name" value={form.lastName} onChange={set('lastName')} error={errors.includes('lastName')} />
                    <Field label="Email Address" type="email" value={form.email} onChange={set('email')} error={errors.includes('email')} />
                    <Field label="Phone Number" type="tel" value={form.phone} onChange={set('phone')} error={errors.includes('phone')} />
                    <Field label={isRide ? 'Company / Group (optional)' : 'Recipient Name (optional)'} value={form.company} onChange={set('company')} className="sm:col-span-2" />
                    <Field label="Special Requests" value={form.notes} onChange={set('notes')} textarea rows={3} placeholder="Accessibility, luggage, stops, instructions…" className="sm:col-span-2" />
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="rounded-[14px] border border-ink/10 bg-white px-5 py-2">
                      <SummaryRow label="Service" value={isRide ? `Tour Bus · ${form.tripType}` : `Courier · ${form.speed}`} />
                      <SummaryRow label="From" value={form.pickup} />
                      <SummaryRow label="To" value={form.destination} />
                      <SummaryRow label="Date & Time" value={`${form.date} · ${form.time}`} />
                      <SummaryRow label={isRide ? 'Vehicle / Group' : 'Package'} value={isRide ? `${vehicle} · ${form.passengers}` : `${form.packageType} · ${form.packageSize}`} />
                      <SummaryRow label="Contact" value={`${form.firstName} ${form.lastName} · ${form.email}`} />
                    </div>
                    <button onClick={() => { setDirection(-1); setStep(0); }} className="mt-3 text-[11px] font-semibold uppercase tracking-[.12em] text-ink/45 underline underline-offset-4 transition-colors hover:text-ink">Modify details</button>
                    <div className="mt-6 rounded-[14px] border border-ink/10 bg-glacier/60 p-5">
                      <p className="label-micro text-ink/45">Price breakdown</p>
                      <div className="mt-4 space-y-2.5 text-[13px] text-ink/70">
                        <div className="flex justify-between"><span>{isRide ? 'Charter base fare' : 'Delivery base rate'}</span><span>{money(base)}</span></div>
                        <div className="flex justify-between"><span>Coordination & service</span><span>{money(serviceFee)}</span></div>
                        <div className="flex justify-between"><span>Estimated tax</span><span>{money(tax)}</span></div>
                      </div>
                      <div className="mt-4 flex items-end justify-between border-t border-ink/10 pt-4">
                        <span className="text-[12px] font-semibold uppercase tracking-[.12em] text-ink/55">Total due</span>
                        <span className="text-[27px] font-medium tracking-tight text-ink">{money(total)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
                    <div className="space-y-3">
                      <PaymentField label="Name on card" value={form.cardName} onChange={set('cardName')} error={errors.includes('cardName')} placeholder="Full name" className="col-span-2" />
                      <div className="relative">
                        <PaymentField label="Card number" value={form.card} onChange={(v) => set('card')(formattedCard(v))} error={errors.includes('card')} placeholder="0000 0000 0000 0000" maxLength={19} />
                        <CreditCard size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/30" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <PaymentField label="Expiration" value={form.expiry} onChange={(v) => set('expiry')(formattedExpiry(v))} error={errors.includes('expiry')} placeholder="MM/YY" maxLength={5} />
                        <PaymentField label="CVV" value={form.cvv} onChange={(v) => set('cvv')(v.replace(/\D/g, '').slice(0, 4))} error={errors.includes('cvv')} placeholder="•••" maxLength={4} />
                        <PaymentField label="Billing ZIP" value={form.zip} onChange={set('zip')} error={errors.includes('zip')} placeholder="10001" maxLength={10} />
                      </div>
                      <div className="flex items-start gap-2.5 rounded-[10px] border border-ink/10 bg-glacier/50 p-3.5 text-[11px] leading-relaxed text-ink/55">
                        <Lock size={15} className="mt-0.5 shrink-0 text-ink/60" />
                        <span><strong className="font-semibold text-ink/80">Secure payment interface.</strong> This is a design demonstration — no payment is processed and no card details are stored or transmitted.</span>
                      </div>
                    </div>
                    <div className="rounded-[14px] bg-ink p-5 text-paper">
                      <p className="label-micro text-frost">Order summary</p>
                      <p className="mt-4 text-[15px] font-medium tracking-tight">{isRide ? 'Executive group charter' : 'Priority courier delivery'}</p>
                      <p className="mt-1 line-clamp-2 text-[12px] font-light text-white/50">{form.pickup} → {form.destination}</p>
                      <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-[12px] text-white/60">
                        <div className="flex justify-between"><span>Subtotal</span><span>{money(base)}</span></div>
                        <div className="flex justify-between"><span>Fees & tax</span><span>{money(serviceFee + tax)}</span></div>
                      </div>
                      <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
                        <span className="text-[11px] uppercase tracking-[.12em] text-white/50">Total</span>
                        <span className="text-[25px] font-medium tracking-tight">{money(total)}</span>
                      </div>
                      <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-[10px] uppercase tracking-[.1em] text-frost">
                        <ShieldCheck size={14} /> Encrypted checkout · Demo mode
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-ink/[.09] bg-paper px-5 py-4 sm:px-9">
                <button onClick={step === 0 ? onClose : back} className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.12em] text-ink/50 transition-colors hover:text-ink">
                  <ArrowLeft size={14} /> {step === 0 ? 'Cancel' : 'Back'}
                </button>
                <div className="flex items-center gap-3">
                  {step === 3 && <span className="hidden text-[11px] text-ink/45 sm:block">Total {money(total)}</span>}
                  <Button variant="dark" onClick={step === 3 ? pay : next} disabled={processing} className="min-w-[158px]">
                    {processing ? 'Processing…' : step === 3 ? `Pay & Confirm · ${money(total)}` : step === 2 ? 'Continue to Payment' : 'Continue'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-scrollbar flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12 text-center sm:px-12">
              <div className="relative mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-ink/10 bg-glacier text-ink">
                <Check size={34} strokeWidth={1.4} className="animate-rise" />
                <span className="pulse-ring absolute inset-0 rounded-full" />
              </div>
              <SectionLabel>Booking Complete</SectionLabel>
              <h2 className="mt-4 text-[38px] font-medium tracking-editorial text-ink sm:text-[46px]">Booking Confirmed</h2>
              <p className="mt-3 max-w-[390px] text-[13px] font-light leading-relaxed text-ink/55">
                Your reservation has been successfully received. A confirmation and detailed itinerary are on their way to {form.email || 'your inbox'}.
              </p>
              <div className="mt-8 w-full max-w-[440px] rounded-[14px] border border-ink/10 bg-white p-5 text-left">
                <div className="flex items-center justify-between border-b border-ink/[.08] pb-4">
                  <span className="label-micro text-ink/45">Confirmation number</span>
                  <span className="text-[15px] font-bold tracking-[.14em] text-ink">{confirmation}</span>
                </div>
                <div className="pt-2">
                  <SummaryRow label="Service" value={isRide ? `Tour Bus · ${vehicle}` : `Courier · ${form.speed}`} />
                  <SummaryRow label="Route" value={`${form.pickup} → ${form.destination}`} />
                  <SummaryRow label="Scheduled" value={`${form.date} · ${form.time}`} />
                  <SummaryRow label="Total" value={money(total)} />
                </div>
              </div>
              <div className="mt-8 flex w-full max-w-[440px] flex-col gap-2.5 sm:flex-row">
                <Button variant="dark" onClick={downloadItinerary} className="flex-1" icon={<Download size={14} />} arrow={false}>Download Itinerary</Button>
                {!isRide ? (
                  <Button variant="ghost" onClick={onTrack} className="flex-1" arrow={false}>Track Delivery</Button>
                ) : (
                  <Button variant="ghost" onClick={onClose} className="flex-1" arrow={false}>Done</Button>
                )}
              </div>
              <button onClick={onClose} className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.12em] text-ink/40 transition-colors hover:text-ink">
                <CheckCircle2 size={14} /> Return to website
              </button>
              <div className="mt-9 flex items-center gap-5 text-ink/35">
                <Mail size={15} /><Phone size={15} /><MapPin size={15} /><Sparkles size={15} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
