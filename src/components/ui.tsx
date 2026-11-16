import { useEffect, useId, useRef, type ReactNode } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { attachMagnetic } from '../lib/motion';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'light' | 'dark';
type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  magnetic?: boolean;
  ariaLabel?: string;
};

export function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  arrow = false,
  icon,
  className = '',
  type = 'button',
  disabled = false,
  magnetic = true,
  ariaLabel,
}: ButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!magnetic || disabled) return;
    return attachMagnetic(ref.current);
  }, [magnetic, disabled]);

  const sizes = {
    sm: 'h-10 px-5 text-[11px]',
    md: 'h-12 px-6 text-[12px]',
    lg: 'h-14 px-8 text-[13px]',
  };
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-paper text-ink hover:bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,.8)]',
    light: 'bg-paper text-ink hover:bg-white',
    dark: 'bg-ink text-paper hover:bg-ink-soft',
    outline: 'border border-white/25 text-paper bg-white/[.03] hover:bg-white hover:text-ink hover:border-white',
    ghost: 'border border-ink/15 text-ink hover:bg-ink hover:text-paper',
  };
  const cls = `group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[.14em] transition-[background-color,color,border-color,box-shadow,transform] duration-500 disabled:cursor-not-allowed disabled:opacity-45 ${sizes[size]} ${variants[variant]} ${className}`;

  const inner = (
    <span className="magnetic-inner whitespace-nowrap">
      {icon}
      {children}
      {(arrow || variant === 'primary' || variant === 'dark') && !icon ? (
        <ArrowUpRight size={15} strokeWidth={1.7} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      ) : arrow ? (
        <ArrowUpRight size={15} strokeWidth={1.7} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      ) : null}
    </span>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement | null>}
        href={href}
        aria-label={ariaLabel}
        onClick={(e) => {
          if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
          onClick?.();
        }}
        className={cls}
      >
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={cls}>
      {inner}
    </button>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'date' | 'time' | 'number' | 'email' | 'tel';
  options?: string[];
  placeholder?: string;
  dark?: boolean;
  error?: boolean;
  className?: string;
  min?: string;
  textarea?: boolean;
  rows?: number;
};

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  options,
  placeholder = '',
  dark = false,
  error = false,
  className = '',
  min,
  textarea = false,
  rows = 3,
}: FieldProps) {
  const id = useId();
  const isSelect = !!options;
  const hasValue = value !== '';
  const tone = dark
    ? 'bg-white/[.045] border-white/[.14] text-paper focus-within:border-frost/70'
    : 'bg-white border-ink/[.12] text-ink focus-within:border-ink/45';
  const errorCls = error ? '!border-red-400/80 !bg-red-400/[.05]' : '';
  const inputCls = `input-reset ${isSelect ? 'appearance-none pr-5' : ''} ${textarea ? 'resize-none !h-auto' : 'h-full'} text-[13px] font-medium`;
  const handle = (e: { target: { value: string } }) => onChange(e.target.value);
  const shared = { id, value, onChange: handle, placeholder: isSelect ? undefined : (placeholder || ' '), className: inputCls };

  return (
    <div className={`${className}`}>
      <div
        className={`field-shell field-with-label relative flex min-h-[58px] items-center rounded-[10px] border px-[14px] ${tone} ${errorCls} ${hasValue || isSelect ? 'has-value' : ''} ${isSelect || textarea || type === 'date' || type === 'time' ? 'always-float' : ''}`}
      >
        {textarea ? (
          <textarea {...shared} rows={rows} className={`${inputCls} !pt-6 pb-3`} />
        ) : isSelect ? (
          <select {...shared} className={`${inputCls} cursor-pointer pr-6`}>
            {options!.map((o) => (
              <option key={o} value={o} className={dark ? 'bg-ink text-paper' : 'bg-white text-ink'}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input {...shared} type={type} min={min} />
        )}
        <label htmlFor={id} className="float-label">
          {label}
        </label>
        <div className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${dark ? 'text-white/40' : 'text-ink/40'}`}>
          {isSelect ? <ChevronDown size={15} strokeWidth={1.7} /> : null}
        </div>
      </div>
      {error && <p className="mt-1.5 pl-1 text-[10px] font-medium tracking-wide text-red-400/90">Please complete this field</p>}
    </div>
  );
}

export function SectionLabel({ children, dark = false, className = '' }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className={`h-px w-7 ${dark ? 'bg-frost/70' : 'bg-ink/35'}`} />
      <span className={`label-micro ${dark ? 'text-frost' : 'text-mist'}`}>{children}</span>
    </div>
  );
}

export function Line({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <span data-line-inner className="block">{children}</span>
    </span>
  );
}

export function Steps({ steps, current, dark = false }: { steps: string[]; current: number; dark?: boolean }) {
  return (
    <div className="flex w-full items-center gap-2">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex flex-1 flex-col gap-2">
            <div className={`h-[3px] w-full rounded-full transition-colors duration-700 ${done || active ? (dark ? 'bg-paper' : 'bg-ink') : dark ? 'bg-white/15' : 'bg-ink/10'}`} />
            <span className={`label-micro hidden sm:block transition-colors duration-500 ${active ? (dark ? 'text-paper' : 'text-ink') : dark ? 'text-white/35' : 'text-ink/35'}`}>
              {String(i + 1).padStart(2, '0')} · {s}
            </span>
          </div>
        );
      })}
    </div>
  );
}
