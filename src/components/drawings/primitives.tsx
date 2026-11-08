/**
 * Primitiven für das Zeichnungsmodul (DESIGN.md §8). Reine Linienzeichnung — anders als das
 * Logo (flache Füllung) nutzen alle Primitiven nur Konturen: kein fill, stroke="currentColor",
 * 1,25 px bei 1× (`vector-effect: non-scaling-stroke` kommt global über die Klasse `.nora-drawing`
 * aus styles.css). Alle Kompositionen sind `aria-hidden="true"` (rein dekorativ).
 */

export const STROKE = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
}

type Box = { x: number; y: number; width: number; height: number }

/** Fenster mit Rahmen, Kämpfer (Querteilung) und Sims — Gründerzeit-Stil. */
export function Fenster({ x, y, width, height, lit = false }: Box & { lit?: boolean }) {
  const kaempferY = y + height * 0.34
  const simsOverhang = width * 0.16
  const simsY = y + height + height * 0.075

  return (
    <g>
      {lit ? (
        <rect className="nora-facade-lit" x={x} y={y} width={width} height={height} fill="var(--color-fensterlicht)" />
      ) : null}
      <rect x={x} y={y} width={width} height={height} {...STROKE} />
      <line x1={x} y1={kaempferY} x2={x + width} y2={kaempferY} {...STROKE} />
      <line x1={x - simsOverhang} y1={simsY} x2={x + width + simsOverhang} y2={simsY} {...STROKE} />
    </g>
  )
}

/** Einfaches Fenster ohne Kämpfer/Sims — für Neubauten (modernerer Ausdruck). */
export function FensterModern({ x, y, width, height }: Box) {
  return <rect x={x} y={y} width={width} height={height} {...STROKE} />
}

/** Balkon mit Geländer (Flachstahl-Sprossen), für Neubau-Kompositionen. */
export function Balkon({ x, y, width, height = 10 }: Box & { height?: number }) {
  const posts = Math.max(3, Math.round(width / 10))
  const spacing = width / (posts - 1)
  return (
    <g>
      <line x1={x} y1={y + height} x2={x + width} y2={y + height} {...STROKE} />
      <line x1={x} y1={y} x2={x} y2={y + height} {...STROKE} />
      <line x1={x + width} y1={y} x2={x + width} y2={y + height} {...STROKE} />
      <line x1={x} y1={y} x2={x + width} y2={y} {...STROKE} />
      {Array.from({ length: posts }, (_, i) => {
        const px = x + i * spacing
        return <line key={i} x1={px} y1={y} x2={px} y2={y + height} {...STROKE} strokeWidth={0.75} />
      })}
    </g>
  )
}

/** Gurtgesims — horizontale Trennlinie zwischen zwei Geschossen. */
export function Gesims({ x, y, width }: { x: number; y: number; width: number }) {
  return <line x1={x} y1={y} x2={x + width} y2={y} {...STROKE} />
}

/** Tür mit Füllungen, optional einen Spalt geöffnet (404-Zeichnung). */
export function Tuer({ x, y, width, height, open = false }: Box & { open?: boolean }) {
  if (!open) {
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} {...STROKE} />
        <line x1={x} y1={y + height * 0.55} x2={x + width} y2={y + height * 0.55} {...STROKE} strokeWidth={0.75} />
        <line x1={x + width / 2} y1={y} x2={x + width / 2} y2={y + height} {...STROKE} strokeWidth={0.75} />
      </g>
    )
  }
  const openWidth = width * 0.8
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} {...STROKE} />
      {/* Türblatt, um die linke Angel geöffnet — perspektivisch verschmälert */}
      <path
        d={`M ${x} ${y} L ${x + openWidth} ${y + height * 0.08} L ${x + openWidth} ${y + height * 0.92} L ${x} ${y + height} Z`}
        {...STROKE}
      />
      <path
        d={`M ${x} ${y} A ${width * 0.95} ${width * 0.95} 0 0 1 ${x + width} ${y}`}
        {...STROKE}
        strokeWidth={0.75}
        strokeDasharray="2 2"
      />
    </g>
  )
}

/** Schaufenster — grosse Glasfläche mit Sprossenraster, Ladengeschoss. */
export function Schaufenster({ x, y, width, height }: Box) {
  const cols = 3
  const colWidth = width / cols
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} {...STROKE} />
      <line
        x1={x}
        y1={y + height - height * 0.08}
        x2={x + width}
        y2={y + height - height * 0.08}
        {...STROKE}
        strokeWidth={0.75}
      />
      {Array.from({ length: cols - 1 }, (_, i) => {
        const lx = x + colWidth * (i + 1)
        return <line key={i} x1={lx} y1={y} x2={lx} y2={y + height} {...STROKE} strokeWidth={0.75} />
      })}
    </g>
  )
}

/** Lukarne (Dachgaube) mit kleinem Fenster. */
export function Lukarne({ x, y, width, height }: Box) {
  const roofHeight = height * 0.45
  return (
    <g>
      <path
        d={`M ${x} ${y + roofHeight} L ${x + width / 2} ${y} L ${x + width} ${y + roofHeight} L ${x + width} ${y + height} L ${x} ${y + height} Z`}
        {...STROKE}
      />
      <rect
        x={x + width * 0.28}
        y={y + roofHeight + height * 0.18}
        width={width * 0.44}
        height={height * 0.42}
        {...STROKE}
      />
    </g>
  )
}

/** Satteldach über der gesamten Fassadenbreite. */
export function Satteldach({ x, y, width, height }: Box) {
  return <path d={`M ${x} ${y + height} L ${x + width / 2} ${y} L ${x + width} ${y + height}`} {...STROKE} />
}

/** Flachdach — schlichte Dachkante, für Neubauten. */
export function Flachdach({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + width} y2={y} {...STROKE} />
      <line x1={x} y1={y - 3} x2={x} y2={y} {...STROKE} strokeWidth={0.75} />
      <line x1={x + width} y1={y - 3} x2={x + width} y2={y} {...STROKE} strokeWidth={0.75} />
    </g>
  )
}

/** Geschossdecke/Schnittlinie für Schnitt-Zeichnungen (doppelt, mit kurzer Schraffur). */
export function Deckenschnitt({ x, y, width }: { x: number; y: number; width: number }) {
  return <line x1={x} y1={y} x2={x + width} y2={y} {...STROKE} strokeWidth={1.75} />
}

/** Wand-Trennlinie für Grundrisse (senkrecht). */
export function Trennwand({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return <line x1={x} y1={y1} x2={x} y2={y2} {...STROKE} />
}

/** Türöffnung im Grundriss: Viertelkreis-Schwenkbereich. */
export function TuerschwungGrundriss({
  x,
  y,
  radius,
  rotation = 0,
}: {
  x: number
  y: number
  radius: number
  rotation?: number
}) {
  return (
    <g transform={`rotate(${rotation} ${x} ${y})`}>
      <line x1={x} y1={y} x2={x} y2={y - radius} {...STROKE} strokeWidth={0.9} />
      <path
        d={`M ${x} ${y - radius} A ${radius} ${radius} 0 0 1 ${x + radius} ${y}`}
        {...STROKE}
        strokeWidth={0.75}
        strokeDasharray="2 2"
      />
    </g>
  )
}
