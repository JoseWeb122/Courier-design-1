import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Bus, Check, ChevronDown, Package, ShieldCheck, Sparkles } from 'lucide-react';
import { Button, Field } from './ui';
import { gsap, prefersReduced } from '../lib/motion';
import type { BookingRequest, ServiceKind } from '../lib/types';

type Tab = ServiceKind;

type FieldConfig = {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'time' | 'number';
  options?: string[];
  placeholder?: string;
};

const rideFields: FieldConfig[] = [
  { key: 'pickup', label: 'Pickup Location', placeholder: 'City or address' },
  { key: 'destination', label: 'Destination', placeholder: 'City or address' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'time', label: 'Time', type: 'time' },
  { key: 'passengers', label: 'Passengers', options: ['1–10 Passengers', '11–24 Passengers', '25–40 Passengers', '41–56 Passengers'] },
];

const courierFields: FieldConfig[] = [
  { key: 'pickup', label: 'Pickup', placeholder: 'Pickup address' },
  { key: 'destination', label: 'Delivery Location', placeholder: 'Delivery address' },
  { key: 'packageType', label: 'Package Type', options: ['Documents', 'Small Parcel', 'Standard Box', 'Fragile / Specialty', 'Pallet / Freight'] },
  { key: 'date', label: 'Delivery Date', type: 'date' },
];

const today = new Date().toISOString().split('T')[0];

export default function Hero({ onBook }: { onBook: (req: BookingRequest) => void }) {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<Tab>('ride');
  const [values, setValues] = useState<Record<string, string>>({
    date: today,
    time: '09:00',
    passengers: '11–24 Passengers',
    packageType: 'Standard Box',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState(false);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-image', { scale: 1.13, opacity: 0.55 }, { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' })
        .fromTo('[data-hero-line]', { yPercent: 112 }, { yPercent: 0, duration: 1.05, stagger: 0.13, ease: 'power4.out' }, 0.12)
        .fromTo('[data-hero]', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.09 }, 0.55);
    }, root);
    return () => ctx.revert();
  }, []);

  const fields = tab === 'ride' ? rideFields : courierFields;
  const update = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => e.filter((k) => k !== key));
  };

  const switchTab = (next: Tab) => {
    setTab(next);
    setResult(false);
    setErrors([]);
  };

  const submit = () => {
    const missing = fields.filter((f) => !values[f.key]).map((f) => f.key);
    if (missing.length) {
      setErrors(missing);
      return;
    }
    setErrors([]);
    setResult(true);
  };

  const prefill: Record<string, string> = { ...values };
  if (tab === 'ride' && !prefill.passengers) prefill.passengers = '11–24 Passengers';

  return (
    <section ref={root} id="home" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      <div className="absolute inset-0 -z-20">
        <img src="/images/hero.jpg" alt="Executive coach traveling through a misty mountain pass at dawn" className="hero-image h-full w-full object-cover object-center" fetchPriority="high" />
      </div>
      <div className="hero-scrim absolute inset-0 -z-10" />
      <div className="grain absolute inset-0 -z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink/80 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-5 pb-8 pt-[130px] sm:px-8 sm:pb-10 lg:px-12 lg:pb-12 xl:pt-[155px]">
        <div className="flex items-end justify-between gap-8">
          <div className="max-w-[900px]">
            <div data-hero className="mb-6 flex items-center gap-3 sm:mb-8">
              <span className="h-px w-8 bg-frost/80" />
              <span className="label-micro text-frost">Premium Mobility · Est. 2014</span>
            </div>
            <h1 className="tracking-editorial text-[clamp(3rem,7.1vw,6.9rem)] font-medium leading-[.96] text-paper">
              <span className="block overflow-hidden"><span data-hero-line className="block">Moving People.</span></span>
              <span className="block overflow-hidden"><span data-hero-line className="block">Moving <em className="display font-normal italic text-frost">What Matters.</em></span></span>
            </h1>
            <p data-hero className="mt-6 max-w-[510px] text-[14px] font-light leading-relaxed text-white/70 sm:text-[16px]">
              Premium group transportation and dependable courier solutions, designed around your schedule.
            </p>
            <div data-hero className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg" onClick={() => onBook({ kind: 'ride' })} className="min-w-[168px]">Book a Ride</Button>
              <Button variant="outline" size="lg" onClick={() => onBook({ kind: 'courier' })} className="min-w-[200px]">Schedule a Delivery</Button>
            </div>
          </div>
          <div data-hero className="hidden flex-col items-center gap-4 pb-2 lg:flex">
            <span className="label-micro [writing-mode:vertical-rl] text-white/40">Scroll to explore</span>
            <span className="h-16 w-px bg-gradient-to-b from-frost/60 to-transparent" />
          </div>
        </div>

        {/* Integrated booking interface */}
        <div data-hero className="glass-dark mt-10 rounded-[18px] p-4 scheme-dark sm:p-5 lg:mt-12 lg:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/[.11] pb-4">
            <div className="flex items-center gap-1 rounded-full border border-white/[.12] bg-black/25 p-1">
              <button
                onClick={() => switchTab('ride')}
                aria-pressed={tab === 'ride'}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[.12em] transition-all duration-400 sm:px-5 ${tab === 'ride' ? 'bg-paper text-ink shadow-lg' : 'text-white/60 hover:text-white'}`}
              >
                <Bus size={14} strokeWidth={1.8} /> Tour Bus
              </button>
              <button
                onClick={() => switchTab('courier')}
                aria-pressed={tab === 'courier'}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[.12em] transition-all duration-400 sm:px-5 ${tab === 'courier' ? 'bg-paper text-ink shadow-lg' : 'text-white/60 hover:text-white'}`}
              >
                <Package size={14} strokeWidth={1.8} /> Courier
              </button>
            </div>
            <div className="hidden items-center gap-2 text-[11px] font-medium text-white/50 sm:flex">
              <ShieldCheck size={14} className="text-frost" /> Instant confirmation · No account required
            </div>
          </div>

          {!result ? (
            <div key={tab} className="animate-rise">
              <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-12 lg:gap-3">
                {fields.map(({ key, ...f }) => (
                  <Field
                    key={key}
                    {...f}
                    dark
                    value={values[key] || ''}
                    onChange={(v) => update(key, v)}
                    error={errors.includes(key)}
                    min={f.type === 'date' ? today : undefined}
                    className="col-span-1 lg:col-span-2"
                  />
                ))}
                <Button
                  variant="primary"
                  onClick={submit}
                  className={`col-span-2 h-[58px] w-full ${tab === 'ride' ? 'lg:col-span-2' : 'lg:col-span-4'}`}
                >
                  {tab === 'ride' ? 'Check Availability' : 'Get Delivery Estimate'}
                </Button>
              </div>
              {errors.length > 0 && (
                <p className="mt-3 text-[11px] font-medium text-red-300/90">Please complete the highlighted fields to continue.</p>
              )}
            </div>
          ) : (
            <div key={`result-${tab}`} className="animate-rise flex flex-col gap-5 py-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-frost/40 bg-frost/10 text-frost"><Check size={19} /></span>
                <div>
                  <p className="label-micro text-frost">{tab === 'ride' ? 'Availability Confirmed' : 'Delivery Estimate Ready'}</p>
                  {tab === 'ride' ? (
                    <p className="mt-1.5 text-[17px] font-medium tracking-tight text-paper sm:text-[19px]">
                      3 executive coaches available · From <span className="text-frost">$890</span> / trip
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[17px] font-medium tracking-tight text-paper sm:text-[19px]">
                      Estimated delivery <span className="text-frost">$42.00</span> · Today by 6:30 PM
                    </p>
                  )}
                  <p className="mt-1 text-[12px] font-light text-white/50">
                    {tab === 'ride'
                      ? `${values.pickup || 'Your pickup'} → ${values.destination || 'your destination'} · Professional chauffeur included`
                      : 'Same-day service · Insured handling · Live tracking included'}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button onClick={() => setResult(false)} className="flex h-12 items-center gap-1.5 rounded-full border border-white/20 px-5 text-[11px] font-semibold uppercase tracking-[.12em] text-white/65 transition-colors hover:text-white">
                  <ChevronDown size={14} className="rotate-90" /> Edit
                </button>
                <Button
                  variant="primary"
                  onClick={() => onBook({ kind: tab, prefill, estimate: tab === 'courier' ? 42 : 890 })}
                  icon={tab === 'ride' ? <Sparkles size={14} /> : undefined}
                >
                  {tab === 'ride' ? 'Continue Booking' : 'Schedule This Delivery'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 hidden -translate-x-1/2 items-center gap-2 pb-1 text-white/25 xl:flex">
        <ArrowRight size={12} className="rotate-90" />
      </div>
    </section>
  );
}
