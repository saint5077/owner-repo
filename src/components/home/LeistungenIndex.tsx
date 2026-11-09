'use client'

import Link from 'next/link'
import { useState } from 'react'

import type { Service } from '@/payload-types'
import { Einfamilienhaus, MFHAnsicht, NeubauBalkone, StockwerkSchnitt } from '@/components/drawings'

const DRAWING = { mfh: MFHAnsicht, schnitt: StockwerkSchnitt, neubau: NeubauBalkone, efh: Einfamilienhaus }

const ROUTE: Record<Service['serviceType'], string> = {
  bewirtschaftung: '/bewirtschaftung',
  stockwerkeigentum: '/stockwerkeigentum',
  erstvermietung: '/erstvermietung',
  verkauf: '/verkauf',
}

const LABEL_DE: Record<Service['serviceType'], string> = {
  bewirtschaftung: 'Bewirtschaftung',
  stockwerkeigentum: 'Stockwerkeigentum',
  erstvermietung: 'Erstvermietung',
  verkauf: 'Verkauf',
}
const LABEL_EN: Record<Service['serviceType'], string> = {
  bewirtschaftung: 'Property Management',
  stockwerkeigentum: 'Stockwerkeigentum',
  erstvermietung: 'Erstvermietung',
  verkauf: 'Verkauf',
}

// Der Bewirtschaftungs-Claim steht bereits im Hero — hier stattdessen eine kurze sachliche
// Beschreibung statt Wiederholung (Briefing §6.1.4).
const BEWIRTSCHAFTUNG_BESCHREIBUNG_DE = 'Vermietung, Unterhalt, Buchhaltung und Abrechnung aus einer Hand.'
const BEWIRTSCHAFTUNG_BESCHREIBUNG_EN = 'Letting, maintenance, bookkeeping and billing, all from one hand.'

type Props = { services: Service[]; locale?: 'de' | 'en' }

export function LeistungenIndex({ services, locale = 'de' }: Props) {
  const [hovered, setHovered] = useState<Service['serviceType'] | null>(null)
  const LABEL = locale === 'en' ? LABEL_EN : LABEL_DE
  const bewirtschaftungBeschreibung = locale === 'en' ? BEWIRTSCHAFTUNG_BESCHREIBUNG_EN : BEWIRTSCHAFTUNG_BESCHREIBUNG_DE
  const hoverHint =
    locale === 'en'
      ? 'Hover over a service to see its drawing. Only Property Management has an English page so far.'
      : 'Zeigt beim Überfahren einer Leistung deren Zeichnung.'

  return (
    <div className="nora-grid items-start gap-y-6">
      <ul className="col-span-12 flex flex-col md:col-span-7">
        {services.map((service) => (
          <li key={service.id} className="border-t border-sandstein/30 last:border-b">
            <Link
              href={locale === 'en' && service.serviceType === 'bewirtschaftung' ? '/en/bewirtschaftung' : ROUTE[service.serviceType]}
              className="group flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:gap-6"
              onMouseEnter={() => setHovered(service.serviceType)}
              onMouseLeave={() => setHovered((v) => (v === service.serviceType ? null : v))}
              onFocus={() => setHovered(service.serviceType)}
              onBlur={() => setHovered((v) => (v === service.serviceType ? null : v))}
            >
              <span className="nora-h3 shrink-0 group-hover:text-fensterladen">{LABEL[service.serviceType]}</span>
              <span className="nora-prose text-[16px] text-tinte-hell">
                {service.serviceType === 'bewirtschaftung' ? bewirtschaftungBeschreibung : service.claim}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="col-span-12 hidden aspect-square items-center justify-center bg-weiss p-8 md:col-span-5 md:flex">
        {hovered ? (
          (() => {
            const service = services.find((s) => s.serviceType === hovered)
            const Drawing = service?.zeichnungsvariante ? DRAWING[service.zeichnungsvariante] : null
            return Drawing ? <Drawing className="h-full w-full text-tinte" /> : null
          })()
        ) : (
          <p className="nora-prose text-center text-[15px] text-tinte-hell">{hoverHint}</p>
        )}
      </div>
    </div>
  )
}
