import { FacadeElevation } from './FacadeElevation'

/** Neubau mit Balkonen — Erstvermietung (DESIGN.md §8). */
export function NeubauBalkone({ className }: { className?: string }) {
  return (
    <FacadeElevation
      className={className}
      floors={4}
      axes={4}
      style="neubau"
      roof="flach"
      egStil="wohnen"
      eingangAchse={0}
      balkonAchsen={[1, 2, 3]}
    />
  )
}
