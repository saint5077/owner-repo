'use client'

const fieldClass = 'nora-prose w-full border border-sandstein/50 bg-weiss px-4 py-3 text-[16px]'
const errorClass = 'border-[#E81D1B]'

// RHF liefert je nach Feldform `FieldError` oder `Merge<FieldError, FieldErrorsImpl<...>>` —
// beide haben ein optionales `message`, mehr wird hier nicht gebraucht; ein eigener, loser Typ
// vermeidet, dass jede Formularkomponente RHFs interne Fehler-Union exakt nachbilden muss.
type DisplayableError = { message?: string } | undefined

function ErrorText({ error }: { error?: DisplayableError }) {
  if (!error) return null
  return (
    <p role="alert" className="nora-prose mt-1.5 text-[13px] text-[#E81D1B]">
      {error.message}
    </p>
  )
}

type BaseProps = {
  label: string
  error?: DisplayableError
  required?: boolean
}

export function TextField({
  label,
  type = 'text',
  error,
  registration,
}: BaseProps & { type?: string; registration: Record<string, unknown> }) {
  return (
    <label className="block">
      <span className="nora-nav-label mb-2 block text-tinte-hell">{label}</span>
      <input
        type={type}
        className={`${fieldClass} ${error ? errorClass : ''}`}
        aria-invalid={Boolean(error)}
        {...registration}
      />
      <ErrorText error={error} />
    </label>
  )
}

export function SelectField({
  label,
  options,
  error,
  registration,
}: BaseProps & { options: { value: string; label: string }[]; registration: Record<string, unknown> }) {
  return (
    <label className="block">
      <span className="nora-nav-label mb-2 block text-tinte-hell">{label}</span>
      <select className={`${fieldClass} ${error ? errorClass : ''}`} aria-invalid={Boolean(error)} {...registration}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ErrorText error={error} />
    </label>
  )
}

export function TextareaField({
  label,
  error,
  registration,
}: BaseProps & { registration: Record<string, unknown> }) {
  return (
    <label className="block">
      <span className="nora-nav-label mb-2 block text-tinte-hell">{label}</span>
      <textarea rows={4} className={`${fieldClass} ${error ? errorClass : ''}`} aria-invalid={Boolean(error)} {...registration} />
      <ErrorText error={error} />
    </label>
  )
}

export function CheckboxGroupField({
  label,
  options,
  registration,
}: {
  label: string
  options: { value: string; label: string }[]
  registration: (value: string) => Record<string, unknown>
}) {
  return (
    <div>
      <span className="nora-nav-label mb-2 block text-tinte-hell">{label}</span>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {options.map((option) => (
          <label key={option.value} className="nora-prose flex items-center gap-2 text-[15px]">
            <input type="checkbox" value={option.value} className="h-4 w-4 accent-sandstein" {...registration(option.value)} />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  )
}

/** Honeypot: für Menschen unsichtbar (nicht nur `display:none` — Screenreader überspringen es via `aria-hidden`+`tabIndex`), Bots füllen es oft trotzdem aus. */
export function HoneypotField({ registration }: { registration: Record<string, unknown> }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...registration} />
      </label>
    </div>
  )
}

export function FormStatusFooter({
  pending,
  success,
  error,
  successLabel,
}: {
  pending: boolean
  success: string | null
  error: string | null
  successLabel?: string
}) {
  return (
    <div className="col-span-12 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={pending}
          className="nora-button-label bg-fensterladen px-6 py-3 text-weiss transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Wird gesendet …' : 'Anfrage senden'}
        </button>
      </div>
      {success ? (
        <p role="status" className="nora-prose text-[14px] text-fensterladen">
          {successLabel ?? success}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="nora-prose text-[14px] text-[#E81D1B]">
          {error}
        </p>
      ) : null}
    </div>
  )
}
