import { FacadeElevation } from './FacadeElevation'

/** Haus mit offener Tür — 404-Seite (DESIGN.md §8). */
export function HausOffeneTuer({ className }: { className?: string }) {
  return (
    <FacadeElevation
      className={className}
      floors={1}
      axes={2}
      style="altbau"
      roof="sattel"
      egStil="wohnen"
      eingangAchse={0}
      eingangOffen
    />
  )
}
