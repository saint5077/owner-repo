import Image from 'next/image'
import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'

import { Logo } from '@/components/branding/Logo'
import { WOCHENTAG_LABEL } from '@/lib/wochentage'

import { Container } from './Container'

const NAV = [
  { label: 'Bewirtschaftung', href: '/bewirtschaftung' },
  { label: 'Stockwerkeigentum', href: '/stockwerkeigentum' },
  { label: 'Erstvermietung', href: '/erstvermietung' },
  { label: 'Verkauf', href: '/verkauf' },
  { label: 'Objekte', href: '/objekte' },
  { label: 'Mieterservice', href: '/mieterservice' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Kontakt', href: '/kontakt' },
]

type FooterProps = { siteSettings: SiteSetting | null }

export function Footer({ siteSettings }: FooterProps) {
  const firma = siteSettings?.firma
  const adresse = firma?.adresse
  const geoeffneteTage = (siteSettings?.oeffnungszeiten?.regulaer ?? []).filter(
    (tag) => !tag.geschlossen && tag.von && tag.bis,
  )

  return (
    <footer className="border-t border-sandstein/30 bg-kalk pb-24 pt-16 lg:pb-16">
      <Container>
        <div className="nora-grid gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <Logo className="mb-4 h-10 w-auto text-tinte" />
            <p className="nora-prose text-tinte-hell">
              {firma?.name ?? 'Nora Immobilien AG'}
              <br />
              {adresse?.strasse ? (
                <>
                  {adresse.strasse}
                  <br />
                </>
              ) : null}
              {adresse?.plz || adresse?.ort ? `${adresse?.plz ?? ''} ${adresse?.ort ?? ''}`.trim() : null}
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

            {geoeffneteTage.length > 0 ? (
              <dl className="nora-prose mt-6 text-tinte-hell">
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

          <nav aria-label="Footer-Navigation" className="col-span-6 md:col-span-4">
            <ul className="flex flex-col gap-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nora-nav-label hover:text-fensterladen">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 flex flex-col gap-6 md:col-span-4">
            <div className="flex items-center gap-6">
              <Image src="/branding/logo-svit.png" alt="SVIT" width={90} height={47} className="h-auto w-20 object-contain" />
              <Image src="/branding/logo-fiabci.png" alt="FIABCI" width={70} height={43} className="h-auto w-16 object-contain" />
            </div>
            <p className="nora-prose text-[13px] text-tinte-hell">
              Schweizerischer Verband der Immobilien-Treuhänder
              <br />
              International Real Estate Federation
            </p>

            <div className="nora-nav-label flex items-center gap-4 text-tinte-hell">
              <Link href="/impressum" className="hover:text-fensterladen">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-fensterladen">
                Datenschutz
              </Link>
            </div>

            <div className="nora-nav-label flex items-center gap-3 text-tinte-hell">
              <span aria-current="true" className="text-tinte">
                DE
              </span>
              <span className="opacity-50" title="Englische Version folgt in Phase 7">
                EN
              </span>
            </div>
          </div>
        </div>

        <p className="mt-16 text-[13px] text-tinte-hell">Website: Axion</p>
      </Container>
    </footer>
  )
}
