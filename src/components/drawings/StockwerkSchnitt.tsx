import { Deckenschnitt, Satteldach, STROKE, Trennwand } from './primitives'

const WIDTH = 10
const FLOOR_HEIGHT = 3.2
const FLOORS = 4
const ROOF_HEIGHT = 2.2

/**
 * Schnitt durch ein Haus mit Geschossen und Wohnungen — Stockwerkeigentum (DESIGN.md §8).
 * Jedes Geschoss ist durch eine eigene, versetzte Trennwand in zwei Einheiten geteilt, um
 * eigenständiges Stockwerkeigentum (statt durchgehender Wohnungen) sichtbar zu machen.
 */
export function StockwerkSchnitt({ className }: { className?: string }) {
  const bodyHeight = FLOORS * FLOOR_HEIGHT
  const totalHeight = bodyHeight + ROOF_HEIGHT
  const partitions = [0.42, 0.58, 0.5, 0.33]

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${totalHeight}`}
      className={['nora-drawing', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
    >
      <Satteldach x={0} y={0} width={WIDTH} height={ROOF_HEIGHT} />

      <Trennwand x={0} y1={ROOF_HEIGHT} y2={totalHeight} />
      <Trennwand x={WIDTH} y1={ROOF_HEIGHT} y2={totalHeight} />

      {Array.from({ length: FLOORS + 1 }, (_, i) => (
        <Deckenschnitt key={i} x={0} y={ROOF_HEIGHT + i * FLOOR_HEIGHT} width={WIDTH} />
      ))}

      {partitions.map((p, i) => {
        const y1 = ROOF_HEIGHT + i * FLOOR_HEIGHT
        const y2 = y1 + FLOOR_HEIGHT
        return <Trennwand key={i} x={p * WIDTH} y1={y1} y2={y2} />
      })}

      {/* Beschriftungslose Markierung je Einheit: kurzer Mittelstrich */}
      {partitions.map((p, i) => {
        const y = ROOF_HEIGHT + i * FLOOR_HEIGHT + FLOOR_HEIGHT / 2
        return (
          <line key={`a${i}`} x1={p * WIDTH * 0.5} y1={y} x2={p * WIDTH * 0.5 + 1.2} y2={y} {...STROKE} strokeWidth={0.75} />
        )
      })}
    </svg>
  )
}
