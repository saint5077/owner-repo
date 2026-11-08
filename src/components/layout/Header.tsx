'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { Logo } from '@/components/branding/Logo'

import { Container } from './Container'

const LEISTUNGEN = [
  { label: 'Bewirtschaftung', href: '/bewirtschaftung' },
  { label: 'Stockwerkeigentum', href: '/stockwerkeigentum' },
  { label: 'Erstvermietung', href: '/erstvermietung' },
  { label: 'Verkauf', href: '/verkauf' },
]

const NAV = [
  { label: 'Objekte', href: '/objekte' },
  { label: 'Mieterservice', href: '/mieterservice' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Kontakt', href: '/kontakt' },
]

type HeaderProps = { telefon?: string }

export function Header({ telefon }: HeaderProps) {
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
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Nora Immobilien AG — Startseite">
          <Logo className="h-9 w-auto text-tinte md:h-11" />
          <span className="nora-nav-label hidden sm:block">Nora Immobilien</span>
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 lg:flex">
          <div className="group relative">
            <button type="button" className="nora-nav-label flex items-center gap-1 py-2">
              Leistungen
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
            <span className="sr-only">Menü {menuOpen ? 'schliessen' : 'öffnen'}</span>
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
            <p className="nora-nav-label px-1 py-2 text-tinte-hell">Leistungen</p>
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
