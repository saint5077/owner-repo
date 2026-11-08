import { STROKE, Trennwand, TuerschwungGrundriss } from './primitives'

const WIDTH = 13
const HEIGHT = 9.5

/** Leerer Grundriss — Leerzustand der Objektliste (DESIGN.md §8, aktuell der reale Zustand). */
export function LeererGrundriss({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={['nora-drawing', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
    >
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} {...STROKE} />

      {/* Trennwand Wohnen/Schlafen, mit Türdurchgang */}
      <Trennwand x={7.8} y1={0} y2={3.2} />
      <Trennwand x={7.8} y1={5.1} y2={HEIGHT} />
      <TuerschwungGrundriss x={7.8} y={5.1} radius={1.6} rotation={90} />

      {/* Trennwand Schlafzimmer/Bad */}
      <Trennwand x={7.8} y1={5.1} y2={HEIGHT} />
      <line x1={7.8} y1={7} x2={WIDTH} y2={7} {...STROKE} />
      <TuerschwungGrundriss x={10.5} y={7} radius={1.3} rotation={0} />

      {/* Eingangstür */}
      <TuerschwungGrundriss x={0} y={HEIGHT * 0.65} radius={1.6} rotation={-90} />
    </svg>
  )
}
