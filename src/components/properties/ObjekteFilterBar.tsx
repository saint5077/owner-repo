'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { withParam, type ParsedPropertyFilters } from '@/lib/property-filters'

const OBJEKTART_OPTIONEN: { value: string; label: string }[] = [
  { value: 'wohnung', label: 'Wohnung' },
  { value: 'maisonette', label: 'Maisonette' },
  { value: 'attika', label: 'Attika' },
  { value: 'studio', label: 'Studio' },
  { value: 'einfamilienhaus', label: 'Einfamilienhaus' },
  { value: 'reihenhaus', label: 'Reihenhaus' },
  { value: 'buero', label: 'Büro' },
  { value: 'gewerbe', label: 'Gewerbe' },
]

const ZIMMER_OPTIONEN = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5]

const MIET_PREIS_BAENDER = [1000, 1500, 2000, 2500, 3000, 4000, 6000]
const KAUF_PREIS_BAENDER = [500_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000]
const FLAECHE_BAENDER = [30, 50, 80, 120, 200]

/**
 * Filtert und sortiert ausschliesslich über die URL-Query (Briefing §6: teilbar, Zurück-Taste
 * funktioniert). Navigation läuft über `router.push` statt eines nativen GET-Formulars, damit
 * es eine clientseitige Soft-Navigation ist — das RSC-Re-Rendering ersetzt nur den Trefferzahl-
 * Text innerhalb der bestehenden `aria-live`-Region, statt die ganze Seite neu zu laden, und die
 * Ansage ist damit für Screenreader tatsächlich eine Live-Region-Aktualisierung, keine blosse
 * neue Seite (verifiziert mit der Playwright-Accessibility-Snapshot, siehe Selbstkritik-Notiz).
 */
export function ObjekteFilterBar({ filters }: { filters: ParsedPropertyFilters }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function navigate(updates: Record<string, string | string[] | null>) {
    const query = withParam(searchParams, updates)
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function toggleListValue(key: 'objektart' | 'kreis', value: string, current: string[] | undefined) {
    const set = new Set(current ?? [])
    if (set.has(value)) set.delete(value)
    else set.add(value)
    navigate({ [key]: set.size > 0 ? Array.from(set) : null })
  }

  const preisBaender = filters.angebotsart === 'kauf' ? KAUF_PREIS_BAENDER : MIET_PREIS_BAENDER

  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="nora-nav-label mb-2 text-tinte-hell">Angebotsart</legend>
        {(
          [
            { value: null, label: 'Alle' },
            { value: 'miete', label: 'Mieten' },
            { value: 'kauf', label: 'Kaufen' },
          ] as const
        ).map((option) => {
          const active = (filters.angebotsart ?? null) === option.value
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={active}
              onClick={() => navigate({ angebotsart: option.value, preisBis: null })}
              className={[
                'nora-nav-label border px-4 py-2',
                active ? 'border-fensterladen bg-fensterladen text-weiss' : 'border-sandstein/50 hover:border-tinte',
              ].join(' ')}
            >
              {option.label}
            </button>
          )
        })}
      </fieldset>

      <div className="nora-grid gap-y-6">
        <fieldset className="col-span-12 md:col-span-6 lg:col-span-4">
          <legend className="nora-nav-label mb-2 text-tinte-hell">Objektart</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {OBJEKTART_OPTIONEN.map((option) => (
              <label key={option.value} className="nora-prose flex items-center gap-2 text-[15px]">
                <input
                  type="checkbox"
                  checked={filters.objektart?.includes(option.value) ?? false}
                  onChange={() => toggleListValue('objektart', option.value, filters.objektart)}
                  className="h-4 w-4 accent-fensterladen"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <label className="block">
            <span className="nora-nav-label mb-2 block text-tinte-hell">Zimmer von</span>
            <select
              value={filters.zimmerVon ?? ''}
              onChange={(e) => navigate({ zimmerVon: e.target.value || null })}
              className="nora-prose w-full border border-sandstein/50 bg-weiss px-3 py-2 text-[16px]"
            >
              <option value="">Beliebig</option>
              {ZIMMER_OPTIONEN.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <label className="block">
            <span className="nora-nav-label mb-2 block text-tinte-hell">Zimmer bis</span>
            <select
              value={filters.zimmerBis ?? ''}
              onChange={(e) => navigate({ zimmerBis: e.target.value || null })}
              className="nora-prose w-full border border-sandstein/50 bg-weiss px-3 py-2 text-[16px]"
            >
              <option value="">Beliebig</option>
              {ZIMMER_OPTIONEN.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filters.angebotsart ? (
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <label className="block">
              <span className="nora-nav-label mb-2 block text-tinte-hell">Preis bis</span>
              <select
                value={filters.preisBis ?? ''}
                onChange={(e) => navigate({ preisBis: e.target.value || null })}
                className="nora-prose w-full border border-sandstein/50 bg-weiss px-3 py-2 text-[16px]"
              >
                <option value="">Beliebig</option>
                {preisBaender.map((p) => (
                  <option key={p} value={p}>
                    {new Intl.NumberFormat('de-CH').format(p)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <label className="block">
            <span className="nora-nav-label mb-2 block text-tinte-hell">Fläche ab</span>
            <select
              value={filters.flaecheAb ?? ''}
              onChange={(e) => navigate({ flaecheAb: e.target.value || null })}
              className="nora-prose w-full border border-sandstein/50 bg-weiss px-3 py-2 text-[16px]"
            >
              <option value="">Beliebig</option>
              {FLAECHE_BAENDER.map((f) => (
                <option key={f} value={f}>
                  {f} m²
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <label className="block">
            <span className="nora-nav-label mb-2 block text-tinte-hell">Verfügbar ab</span>
            <input
              type="date"
              value={filters.verfuegbarAb ?? ''}
              onChange={(e) => navigate({ verfuegbarAb: e.target.value || null })}
              className="nora-prose w-full border border-sandstein/50 bg-weiss px-3 py-2 text-[16px]"
            />
          </label>
        </div>

        <fieldset className="col-span-12 md:col-span-6 lg:col-span-4">
          <legend className="nora-nav-label mb-2 text-tinte-hell">Kreis</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((k) => (
              <label key={k} className="nora-prose flex items-center gap-1.5 text-[15px]">
                <input
                  type="checkbox"
                  checked={filters.kreis?.includes(k) ?? false}
                  onChange={() => toggleListValue('kreis', k, filters.kreis)}
                  className="h-4 w-4 accent-fensterladen"
                />
                {k}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-sandstein/30 pt-6">
        <label className="flex items-center gap-2">
          <span className="nora-nav-label text-tinte-hell">Sortierung</span>
          <select
            value={filters.sort}
            onChange={(e) => navigate({ sort: e.target.value === 'neueste' ? null : e.target.value })}
            className="nora-prose border border-sandstein/50 bg-weiss px-3 py-2 text-[16px]"
          >
            <option value="neueste">Neueste</option>
            <option value="preis-auf">Preis aufsteigend</option>
            <option value="preis-ab">Preis absteigend</option>
            <option value="zimmer">Zimmer</option>
          </select>
        </label>

        <div className="flex gap-2" role="group" aria-label="Ansicht">
          {(['liste', 'karte'] as const).map((ansicht) => {
            const active = filters.ansicht === ansicht
            return (
              <button
                key={ansicht}
                type="button"
                aria-pressed={active}
                onClick={() => navigate({ ansicht: ansicht === 'liste' ? null : ansicht })}
                className={[
                  'nora-nav-label border px-4 py-2',
                  active ? 'border-fensterladen bg-fensterladen text-weiss' : 'border-sandstein/50 hover:border-tinte',
                ].join(' ')}
              >
                {ansicht === 'liste' ? 'Liste' : 'Karte'}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
