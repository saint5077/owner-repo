'use client'

import { useEffect, useState } from 'react'

import { getZuercherTageszeit, type Tageszeit } from '@/lib/zurich-time'

import { FacadeElevation } from './FacadeElevation'

/** Deterministisches Pseudo-Zufallsmass je Fenster (Geschoss/Achse), stabil über Re-Renders. */
function fensterSeed(floor: number, axis: number): number {
  const n = Math.sin(floor * 31.7 + axis * 17.3 + 7.1) * 10000
  return Math.abs(n - Math.floor(n))
}

type HeroFacadeProps = { className?: string }

/**
 * Die Hero-Fassade: zeichnet sich einmalig selbst (CSS, siehe styles.css `.nora-facade-draw`);
 * die Fensterbeleuchtung folgt der Zürcher Tageszeit und wird erst nach dem Mounten berechnet,
 * um einen Hydration-Mismatch zu vermeiden (DESIGN.md §8).
 */
export function HeroFacade({ className }: HeroFacadeProps) {
  const [tageszeit, setTageszeit] = useState<Tageszeit | null>(null)

  useEffect(() => {
    setTageszeit(getZuercherTageszeit())
    const interval = setInterval(() => setTageszeit(getZuercherTageszeit()), 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getLit = (floor: number, axis: number): boolean => {
    if (!tageszeit || tageszeit === 'tag') return false
    const schwelle = tageszeit === 'abend' ? 0.22 : 0.07
    return fensterSeed(floor, axis) < schwelle
  }

  return (
    <div className={className}>
      <FacadeElevation
        floors={4}
        axes={6}
        style="altbau"
        roof="sattel"
        lukarnen
        eingangAchse={3}
        animated
        getLit={tageszeit ? getLit : undefined}
      />
    </div>
  )
}
