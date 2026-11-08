'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

const ANLIEGEN = [
  { value: 'verwaltung', label: 'Verwaltung', hinweis: 'Für Anfragen zur Bewirtschaftung Ihrer Liegenschaft.' },
  { value: 'stockwerkeigentum', label: 'Stockwerkeigentum', hinweis: 'Für Anfragen zur STWEG-Verwaltung.' },
  { value: 'erstvermietung', label: 'Erstvermietung', hinweis: 'Für die Vermietung einer Liegenschaft.' },
  { value: 'verkauf', label: 'Verkauf / Ersteinschätzung', hinweis: 'Für eine Ersteinschätzung zum Verkauf.' },
  { value: 'mieteranliegen', label: 'Mieteranliegen', hinweis: 'Für Schäden nutzen Sie bitte direkt die Schadenmeldung.' },
  { value: 'allgemein', label: 'Allgemein', hinweis: 'Für alle anderen Anliegen.' },
] as const

/**
 * Setzt die Vorauswahl aus `?anliegen=…` (Briefing §6 Kontakt, Direktlinks wie
 * `/kontakt?anliegen=verwaltung`). Die Felder passen sich inhaltlich noch nicht an — das braucht
 * die Formularlogik aus Phase 6; hier nur die Auswahl selbst plus ein kurzer Kontexthinweis.
 */
export function AnliegenSelect() {
  const searchParams = useSearchParams()
  const initial = ANLIEGEN.find((a) => a.value === searchParams.get('anliegen'))?.value ?? ANLIEGEN[5].value
  const [value, setValue] = useState<string>(initial)
  const aktuell = ANLIEGEN.find((a) => a.value === value)

  return (
    <div>
      <label className="block">
        <span className="nora-nav-label mb-2 block text-tinte-hell">Anliegen</span>
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="nora-prose w-full border border-sandstein/50 bg-weiss px-4 py-3 text-[16px]"
        >
          {ANLIEGEN.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </label>
      {aktuell ? <p className="nora-prose mt-2 text-[14px] text-tinte-hell">{aktuell.hinweis}</p> : null}
    </div>
  )
}
