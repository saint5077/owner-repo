'use client'

import { useEffect, useRef } from 'react'
// maplibre-gl 6.x hat keinen Default-Export mehr (anders als ältere Major-Versionen) — benannte
// Importe, gegen die tatsächlich installierte Typdeklaration geprüft (DECISIONS.md Phase 5).
import { LngLatBounds, Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const STYLE_URL = 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.lightbasemap.vt/style.json'
const ZURICH_CENTER: [number, number] = [8.5417, 47.3769]

// maplibre-gl lädt seinen Web Worker intern über `new Worker(new URL(e, import.meta.url))` mit
// einer Laufzeit-Variable statt einem String-Literal — Turbopack kann das nicht statisch
// erkennen und bündelt die Worker-Datei nicht, was zur Laufzeit mit "Worker failed to load"
// scheitert (verifiziert per Playwright-Konsolen-Log, nicht nur vermutet; DECISIONS.md Phase 5).
// Fix laut maplibre-gl selbst (`setWorkerUrl` ist genau dafür exportiert): eigene Kopie der
// Worker-Datei unter `public/vendor/` statisch ausliefern und explizit referenzieren, bevor die
// erste Map erzeugt wird.
setWorkerUrl('/vendor/maplibre-gl-worker.mjs')

export type MapMarker = {
  id: string
  lat: number
  lng: number
  label: string
  href?: string
  /** Näherungswert (Kreis-Zentrum statt echter Adresse) — wird als Kreis statt Pin dargestellt. */
  approximate?: boolean
}

/**
 * Lazy per `next/dynamic` (`ssr: false`) importiert, nie beim ersten Laden der Objektliste
 * mitgeladen (Umsetzungsplan Phase 5). Style-URL und Verfügbarkeit gegen die echte swisstopo-API
 * geprüft (siehe DECISIONS.md), nicht nur angenommen. "© swisstopo"-Attribution ist Teil des
 * Styles selbst und wird von MapLibres `AttributionControl` automatisch angezeigt.
 */
export function PropertyMap({ markers, className }: { markers: MapMarker[]; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new MapLibreMap({
      container: containerRef.current,
      style: STYLE_URL,
      center: ZURICH_CENTER,
      zoom: 11,
      attributionControl: { compact: true },
    })
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right')
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const markerInstances: Marker[] = []
    const apply = () => {
      for (const m of markers) {
        const el = document.createElement(m.href ? 'a' : 'div')
        if (m.href && el instanceof HTMLAnchorElement) el.href = m.href
        el.setAttribute('aria-label', m.label)
        el.style.display = 'block'
        el.style.width = m.approximate ? '28px' : '14px'
        el.style.height = m.approximate ? '28px' : '14px'
        el.style.borderRadius = '50%'
        el.style.cursor = m.href ? 'pointer' : 'default'
        if (m.approximate) {
          el.style.background = 'color-mix(in srgb, #2f5b45 22%, transparent)'
          el.style.border = '1.5px solid #2f5b45'
        } else {
          el.style.background = '#2f5b45'
          el.style.border = '2px solid #ffffff'
        }

        const marker = new Marker({ element: el }).setLngLat([m.lng, m.lat]).addTo(map)
        markerInstances.push(marker)
      }

      if (markers.length > 1) {
        const bounds = new LngLatBounds()
        for (const m of markers) bounds.extend([m.lng, m.lat])
        map.fitBounds(bounds, { padding: 48, maxZoom: 14, duration: 0 })
      } else if (markers.length === 1) {
        map.jumpTo({ center: [markers[0].lng, markers[0].lat], zoom: 14 })
      }
    }

    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)

    // Setzt ein Daten-Attribut, sobald keine Kachel-Anfragen mehr ausstehen — nicht nur fürs
    // Rendering kosmetisch, sondern ein stabiler Haken für automatisierte Tests (Playwright,
    // Phase 8), die sonst auf einen beliebigen Timeout angewiesen wären, um "Karte tatsächlich
    // fertig gezeichnet" von "Canvas-Element existiert, Kacheln laden noch" zu unterscheiden.
    const markIdle = () => containerRef.current?.querySelector('canvas')?.setAttribute('data-qa-idle', '1')
    map.on('idle', markIdle)

    return () => {
      map.off('idle', markIdle)
      for (const m of markerInstances) m.remove()
    }
  }, [markers])

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Karte mit Objektstandorten"
      className={['h-full w-full', className].filter(Boolean).join(' ')}
    />
  )
}
