/**
 * Reine Feld-Optik für die Formular-„Form" auf den Leistungsseiten (Briefing §6 Abschluss,
 * Felder nach §9) — bewusst kein <form>, kein onSubmit, kein Server Action: die eigentliche
 * Formularlogik (React Hook Form, Zod, Server Actions, Spam-Schutz) kommt in Phase 6. Diese
 * Komponenten legen nur das Feldraster fest, an das Phase 6 andockt.
 */

const fieldClass = 'nora-prose w-full border border-sandstein/50 bg-weiss px-4 py-3 text-[16px]'

export function TextField({ label, type = 'text' }: { label: string; type?: string }) {
  return (
    <label className="block">
      <span className="nora-nav-label mb-2 block text-tinte-hell">{label}</span>
      <input type={type} disabled className={fieldClass} />
    </label>
  )
}

export function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="nora-nav-label mb-2 block text-tinte-hell">{label}</span>
      <select disabled className={fieldClass}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

export function TextareaField({ label }: { label: string }) {
  return (
    <label className="block">
      <span className="nora-nav-label mb-2 block text-tinte-hell">{label}</span>
      <textarea disabled rows={4} className={fieldClass} />
    </label>
  )
}

export function FormShapeFooter() {
  return (
    <div className="col-span-12 flex items-center justify-between gap-4">
      <button type="button" disabled className="nora-button-label bg-sandstein/40 px-6 py-3 text-tinte-hell">
        Anfrage senden
      </button>
      <p className="nora-prose text-[14px] text-tinte-hell">Formularversand folgt in Kürze.</p>
    </div>
  )
}
