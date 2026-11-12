import type { InputHTMLAttributes, ReactNode } from 'react';

export const primaryButton =
  'flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500';
export const secondaryButton =
  'flex min-h-12 shrink-0 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-bold hover:bg-page disabled:cursor-not-allowed disabled:text-subtle';

export function FormPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[480px] px-5 py-12 sm:py-16">
      <title>{`UMCine | ${title}`}</title>
      <h1 className="mb-3 text-center text-[28px] font-extrabold tracking-tight">{title}</h1>
      {description && (
        <p className="mb-9 text-center text-sm leading-6 text-muted">{description}</p>
      )}
      {children}
    </section>
  );
}

export function FormField({
  label,
  error,
  hint,
  action,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  action?: ReactNode;
}) {
  const help = error || hint;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          {...props}
          id={id}
          aria-invalid={!!error}
          aria-describedby={help ? `${id}-help` : undefined}
          className="min-h-12 w-full min-w-0 rounded-lg border border-line bg-white px-4 text-sm placeholder:text-subtle disabled:bg-slate-100 aria-invalid:border-red-500"
        />
        {action}
      </div>
      {help && (
        <p
          id={`${id}-help`}
          className={`mt-2 text-xs leading-5 ${error ? 'text-red-600' : 'text-muted'}`}
        >
          {help}
        </p>
      )}
    </div>
  );
}
