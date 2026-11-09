'use client'

import dynamic from 'next/dynamic'

import type { MapMarker } from './PropertyMap'

// `ssr: false` ist nur innerhalb einer Client-Component-Datei gültig (Next-Doku, Lazy Loading) —
// dieser Wrapper ist der Grund, warum `PropertyMap` selbst keinen dynamic()-Aufruf enthält.
const PropertyMap = dynamic(() => import('./PropertyMap').then((m) => m.PropertyMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sandstein/10">
      <p className="nora-nav-label text-tinte-hell">Karte wird geladen …</p>
    </div>
  ),
})

export function LazyPropertyMap({ markers, className }: { markers: MapMarker[]; className?: string }) {
  return <PropertyMap markers={markers} className={className} />
}
