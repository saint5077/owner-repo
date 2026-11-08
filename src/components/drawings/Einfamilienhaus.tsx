import { FacadeElevation } from './FacadeElevation'

/** Einfamilienhaus — Verkauf (DESIGN.md §8). */
export function Einfamilienhaus({ className }: { className?: string }) {
  return (
    <FacadeElevation
      className={className}
      floors={1}
      axes={2}
      style="altbau"
      roof="sattel"
      egStil="wohnen"
      eingangAchse={0}
    />
  )
}
