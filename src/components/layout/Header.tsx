'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { Logo } from '@/components/branding/Logo'

import { Container } from './Container'

const LEISTUNGEN_DE = [
  { label: 'Bewirtschaftung', href: '/bewirtschaftung' },
  { label: 'Stockwerkeigentum', href: '/stockwerkeigentum' },
  { label: 'Erstvermietung', href: '/erstvermietung' },
  { label: 'Verkauf', href: '/verkauf' },
]
const NAV_DE = [
  { label: 'Objekte', href: '/objekte' },
  { label: 'Mieterservice', href: '/mieterservice' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Kontakt', href: '/kontakt' },
]

// Nur die Seiten, die diese Phase tatsächlich übersetzt hat (Homepage, Bewirtschaftung) bekommen
// einen echten /en-Link; alle anderen verlinken bewusst auf die deutsche Seite statt auf eine
// nicht existierende /en-Route — kein totes englisches Menü vortäuschen (CONTENT_TODO.md).
const LEISTUNGEN_EN = [
  { label: 'Property Management', href: '/en/bewirtschaftung' },
  { label: 'Condominium Management', href: '/stockwerkeigentum' },
  { label: 'First Letting', href: '/erstvermietung' },
  { label: 'Sale', href: '/verkauf' },
]
const NAV_EN = [
  { label: 'Properties', href: '/objekte' },
  { label: 'Tenant Service', href: '/mieterservice' },
  { label: 'About Us', href: '/ueber-uns' },
  { label: 'Contact', href: '/kontakt' },
]

type HeaderProps = { telefon?: string; locale?: 'de' | 'en' }

export function Header({ telefon, locale = 'de' }: HeaderProps) {
  const LEISTUNGEN = locale === 'en' ? LEISTUNGEN_EN : LEISTUNGEN_DE
  const NAV = locale === 'en' ? NAV_EN : NAV_DE
  const leistungenLabel = locale === 'en' ? 'Services' : 'Leistungen'
  const menuLabel = locale === 'en' ? 'Menu' : 'Menü'
  const closeLabel = locale === 'en' ? 'close' : 'schliessen'
  const openLabel = locale === 'en' ? 'open' : 'öffnen'
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const goingDown = y > lastY.current
        setVisible(!goingDown || y < 80)
        lastY.current = y
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-sandstein/30 bg-kalk/95 backdrop-blur transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
    >
      <Container className="flex h-16 items-center justify-between gap-6 md:h-20">
        <Link
          href={locale === 'en' ? '/en' : '/'}
          className="flex shrink-0 items-center gap-3"
          aria-label={locale === 'en' ? 'Nora Immobilien AG — Home' : 'Nora Immobilien AG — Startseite'}
        >
          <Logo className="h-9 w-auto text-tinte md:h-11" />
          <span className="nora-nav-label hidden sm:block">Nora Immobilien</span>
        </Link>

        <nav aria-label={locale === 'en' ? 'Main navigation' : 'Hauptnavigation'} className="hidden items-center gap-8 lg:flex">
          <div className="group relative">
            <button type="button" className="nora-nav-label flex items-center gap-1 py-2">
              {leistungenLabel}
            </button>
            <ul
              className="invisible absolute left-0 top-full min-w-56 translate-y-1 rounded-sm border border-sandstein/40 bg-weiss py-2 opacity-0 shadow-sm transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
            >
              {LEISTUNGEN.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nora-nav-label block px-4 py-2 hover:text-fensterladen">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="nora-nav-label hover:text-fensterladen">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {telefon ? (
            <a href={`tel:${telefon.replace(/\s|\(0\)/g, '')}`} className="nora-nav-label hidden tabular-nums lg:block">
              {telefon}
            </a>
          ) : null}
          <button
            type="button"
            className="nora-nav-label flex h-10 w-10 items-center justify-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobilmenue"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">
              {menuLabel} {menuOpen ? closeLabel : openLabel}
            </span>
            <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
              <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div id="mobilmenue" className="border-t border-sandstein/30 bg-kalk lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <p className="nora-nav-label px-1 py-2 text-tinte-hell">{leistungenLabel}</p>
            {LEISTUNGEN.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nora-nav-label px-1 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-sandstein/30" />
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nora-nav-label px-1 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {telefon ? (
              <a href={`tel:${telefon.replace(/\s|\(0\)/g, '')}`} className="nora-nav-label px-1 py-3 tabular-nums">
                {telefon}
              </a>
            ) : null}
          </Container>
        </div>
      ) : null}
    </header>
  )
}
