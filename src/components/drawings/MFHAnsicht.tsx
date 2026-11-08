import { FacadeElevation } from './FacadeElevation'

/** Mehrfamilienhaus-Ansicht — Bewirtschaftung (DESIGN.md §8). Statisch, keine Animation. */
export function MFHAnsicht({ className }: { className?: string }) {
  return (
    <FacadeElevation
      className={className}
      floors={3}
      axes={4}
      style="altbau"
      roof="sattel"
      eingangAchse={2}
    />
  )
}
