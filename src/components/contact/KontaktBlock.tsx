import type { SiteSetting } from '@/payload-types'
import { OpeningHoursStatus } from '@/components/ui/OpeningHoursStatus'
import { WOCHENTAG_LABEL } from '@/lib/wochentage'

type Props = { siteSettings: SiteSetting | null }

/** Wiederverwendet auf der Startseite und auf /kontakt — selbe Quelle, selbe Darstellung. */
export function KontaktBlock({ siteSettings }: Props) {
  const firma = siteSettings?.firma
  const geoeffneteTage = (siteSettings?.oeffnungszeiten?.regulaer ?? []).filter(
    (tag) => !tag.geschlossen && tag.von && tag.bis,
  )

  return (
    <div className="nora-grid gap-y-6">
      <div className="col-span-12 md:col-span-6">
        <p className="nora-prose text-tinte-hell">
          {firma?.name ?? 'Nora Immobilien AG'}
          <br />
          {firma?.adresse?.strasse ? (
            <>
              {firma.adresse.strasse}
              <br />
            </>
          ) : null}
          {firma?.adresse?.plz || firma?.adresse?.ort
            ? `${firma?.adresse?.plz ?? ''} ${firma?.adresse?.ort ?? ''}`.trim()
            : null}
        </p>
        {firma?.telefon ? (
          <p className="nora-prose mt-2">
            <a href={`tel:${firma.telefon.replace(/\s|\(0\)/g, '')}`} className="tabular-nums hover:text-fensterladen">
              {firma.telefon}
            </a>
          </p>
        ) : null}
        {firma?.email ? (
          <p className="nora-prose">
            <a href={`mailto:${firma.email}`} className="hover:text-fensterladen">
              {firma.email}
            </a>
          </p>
        ) : null}
      </div>
      <div className="col-span-12 md:col-span-6">
        <OpeningHoursStatus oeffnungszeiten={siteSettings?.oeffnungszeiten} />
        {geoeffneteTage.length > 0 ? (
          <dl className="nora-prose mt-3 text-tinte-hell">
            {geoeffneteTage.map((tag) => (
              <div key={tag.tag} className="flex justify-between gap-4 text-[15px]">
                <dt>{WOCHENTAG_LABEL[tag.tag ?? ''] ?? tag.tag}</dt>
                <dd className="tabular-nums">
                  {tag.von}–{tag.bis}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  )
}
