import type { ReactNode } from 'react'

import {
  Balkon,
  FensterModern,
  Fenster,
  Flachdach,
  Gesims,
  Lukarne,
  Satteldach,
  Schaufenster,
  Tuer,
} from './primitives'

export type FacadeStyle = 'altbau' | 'neubau'

export type FacadeOptions = {
  /** Anzahl Obergeschosse (ohne Erdgeschoss/Dach). */
  floors: number
  /** Anzahl Fensterachsen. */
  axes: number
  style?: FacadeStyle
  roof?: 'sattel' | 'flach' | 'keines'
  lukarnen?: boolean
  /** 0-basierte Achsen-Indizes, die im Neubau-Stil einen Balkon statt Fenster erhalten. */
  balkonAchsen?: number[]
  /** 0-basierter Achsen-Index des Hauseingangs im Erdgeschoss; übrige Achsen = Schaufenster/Fenster. */
  eingangAchse?: number
  /** Erdgeschoss-Charakter: 'gewerbe' = Schaufenster (Hero/MFH), 'wohnen' = normale Fenster (EFH). */
  egStil?: 'gewerbe' | 'wohnen'
  /** Türblatt einen Spalt geöffnet (404-Zeichnung). */
  eingangOffen?: boolean
  /** (Geschoss ab Erdgeschoss = 0, Achse) → beleuchtet (nur Hero). */
  getLit?: (floor: number, axis: number) => boolean
  /** Fügt die Selbstzeichnen-Animationsklasse hinzu (nur Hero). */
  animated?: boolean
  className?: string
}

const AXIS_SPACING = 2.6
const MARGIN = 1.1
const WINDOW_WIDTH = 1.2
const WINDOW_HEIGHT = 2.0
const EG_HEIGHT = 4.0
const OG_HEIGHT = 3.2
const ROOF_HEIGHT = 3.4
const LUKARNE_WIDTH = 1.5
const LUKARNE_HEIGHT = 2.2

export function FacadeElevation({
  floors,
  axes,
  style = 'altbau',
  roof = 'sattel',
  lukarnen = false,
  balkonAchsen = [],
  eingangAchse,
  egStil = 'gewerbe',
  eingangOffen = false,
  getLit,
  animated = false,
  className,
}: FacadeOptions) {
  const facadeWidth = axes * AXIS_SPACING + MARGIN * 2
  const bodyHeight = EG_HEIGHT + floors * OG_HEIGHT
  const totalHeight = bodyHeight + (roof === 'sattel' ? ROOF_HEIGHT : roof === 'flach' ? 1.2 : 0)
  const eingang = eingangAchse ?? Math.floor(axes / 2)

  const axisX = (axis: number) => MARGIN + axis * AXIS_SPACING + (AXIS_SPACING - WINDOW_WIDTH) / 2

  // Geschosse von oben (Dach) nach unten aufbauen; y=0 ist die Dachspitze, Boden = totalHeight.
  const roofBottomY = roof === 'keines' ? 0 : roof === 'flach' ? 1.2 : ROOF_HEIGHT
  let cursorY = roofBottomY

  const floorLines: ReactNode[] = []
  const windows: ReactNode[] = []

  for (let f = floors; f >= 1; f -= 1) {
    const floorTop = cursorY
    const floorBottom = cursorY + OG_HEIGHT
    const windowY = floorBottom - WINDOW_HEIGHT - 0.55

    for (let a = 0; a < axes; a += 1) {
      const isBalkon = style === 'neubau' && balkonAchsen.includes(a)
      const x = axisX(a)
      const lit = getLit?.(f, a) ?? false

      if (isBalkon) {
        windows.push(
          <g key={`f${f}a${a}`}>
            {style === 'neubau' ? (
              <FensterModern x={x} y={windowY} width={WINDOW_WIDTH} height={WINDOW_HEIGHT} />
            ) : (
              <Fenster x={x} y={windowY} width={WINDOW_WIDTH} height={WINDOW_HEIGHT} lit={lit} />
            )}
            <Balkon x={x - 0.3} y={floorBottom - 0.1} width={WINDOW_WIDTH + 0.6} height={0.9} />
          </g>,
        )
      } else if (style === 'neubau') {
        windows.push(<FensterModern key={`f${f}a${a}`} x={x} y={windowY} width={WINDOW_WIDTH} height={WINDOW_HEIGHT} />)
      } else {
        windows.push(<Fenster key={`f${f}a${a}`} x={x} y={windowY} width={WINDOW_WIDTH} height={WINDOW_HEIGHT} lit={lit} />)
      }
    }

    floorLines.push(<Gesims key={`g${f}`} x={0} y={floorTop} width={facadeWidth} />)
    cursorY = floorBottom
  }

  // Erdgeschoss
  const egTop = cursorY
  const egBottom = egTop + EG_HEIGHT
  floorLines.push(<Gesims key="g-eg" x={0} y={egTop} width={facadeWidth} />)

  const egElements: ReactNode[] = []
  for (let a = 0; a < axes; a += 1) {
    const x = MARGIN + a * AXIS_SPACING
    if (a === eingang) {
      egElements.push(
        <Tuer
          key={`eg-tuer`}
          x={x + (AXIS_SPACING - 1.1) / 2}
          y={egBottom - 2.6}
          width={1.1}
          height={2.6}
          open={eingangOffen}
        />,
      )
    } else if (egStil === 'gewerbe') {
      egElements.push(
        <Schaufenster key={`eg-sf${a}`} x={x + 0.25} y={egTop + 0.5} width={AXIS_SPACING - 0.5} height={EG_HEIGHT - 1.1} />,
      )
    } else {
      const fx = x + (AXIS_SPACING - WINDOW_WIDTH) / 2
      egElements.push(
        <Fenster key={`eg-f${a}`} x={fx} y={egBottom - WINDOW_HEIGHT - 0.55} width={WINDOW_WIDTH} height={WINDOW_HEIGHT} />,
      )
    }
  }

  const rootClassName = ['nora-drawing', animated ? 'nora-facade-draw' : null, className].filter(Boolean).join(' ')

  return (
    <svg
      viewBox={`0 0 ${facadeWidth} ${totalHeight}`}
      className={rootClassName}
      aria-hidden="true"
      focusable="false"
    >
      {roof === 'sattel' ? <Satteldach x={0} y={0} width={facadeWidth} height={ROOF_HEIGHT} /> : null}
      {roof === 'flach' ? <Flachdach x={0} y={1.2} width={facadeWidth} /> : null}
      {roof === 'sattel' && lukarnen
        ? [axes * 0.26, axes * 0.72].map((axisPos, i) => {
            const cx = MARGIN + axisPos * AXIS_SPACING
            const roofSlopeY = ROOF_HEIGHT * (1 - Math.abs(cx - facadeWidth / 2) / (facadeWidth / 2)) * 0.72
            return (
              <Lukarne
                key={i}
                x={cx - LUKARNE_WIDTH / 2}
                y={Math.max(0.3, roofSlopeY - LUKARNE_HEIGHT * 0.55)}
                width={LUKARNE_WIDTH}
                height={LUKARNE_HEIGHT}
              />
            )
          })
        : null}

      {floorLines}
      {windows}
      {egElements}

      {/* Bodenlinie */}
      <Gesims x={0} y={totalHeight} width={facadeWidth} />
    </svg>
  )
}
