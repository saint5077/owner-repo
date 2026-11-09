'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'

export type GalleryImage = { id: string; url: string; alt: string; width?: number | null; height?: number | null }

/**
 * Galerie mit Lightbox. Die Lightbox nutzt das native `<dialog>`-Element: `showModal()` liefert
 * Fokus-Falle und Escape-zum-Schliessen ohne eigene Implementierung, Embla übernimmt Wischen
 * (Touch) und wird zusätzlich per Pfeiltasten bedient (Briefing §6 Objektdetail: "Lightbox mit
 * Wischen und Tastatur").
 */
export function Gallery({ images, fallback }: { images: GalleryImage[]; fallback: React.ReactNode }) {
  const [index, setIndex] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 })

  const open = useCallback(
    (i: number) => {
      setIndex(i)
      dialogRef.current?.showModal()
      // Direkter, imperativer Sprung statt über einen auf `index` lauschenden Effekt — der
      // würde sich mit dem "select"-Listener unten (der denselben State setzt) überschneiden.
      emblaApi?.scrollTo(i, true)
    },
    [emblaApi],
  )

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') emblaApi?.scrollNext()
      if (e.key === 'ArrowLeft') emblaApi?.scrollPrev()
    }
    dialog.addEventListener('keydown', onKeyDown)
    return () => dialog.removeEventListener('keydown', onKeyDown)
  }, [emblaApi])

  if (images.length === 0) {
    return <div className="aspect-[4/3] w-full bg-weiss p-10 md:aspect-[16/9]">{fallback}</div>
  }

  const [hauptbild, ...weitere] = images

  return (
    <div>
      <div className="nora-grid gap-2">
        <button
          type="button"
          onClick={() => open(0)}
          className="relative col-span-12 aspect-[16/10] overflow-hidden bg-sandstein/10 md:col-span-8"
        >
          <Image src={hauptbild.url} alt={hauptbild.alt} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" priority />
        </button>
        <div className="col-span-12 grid grid-cols-4 gap-2 md:col-span-4 md:grid-cols-2">
          {weitere.slice(0, 4).map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => open(i + 1)}
              className="relative aspect-square overflow-hidden bg-sandstein/10"
            >
              <Image src={img.url} alt={img.alt} fill sizes="25vw" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Bildergalerie"
        className="h-full max-h-none w-full max-w-none bg-tinte/95 p-0 backdrop:bg-tinte/70"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <p className="nora-nav-label text-weiss">
              {index + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="nora-nav-label border border-weiss/40 px-3 py-1.5 text-weiss hover:bg-weiss/10"
            >
              Schliessen
            </button>
          </div>
          <div ref={emblaRef} className="min-h-0 flex-1 overflow-hidden">
            <div className="flex h-full">
              {images.map((img) => (
                <div key={img.id} className="relative h-full min-w-0 flex-[0_0_100%]">
                  <Image src={img.url} alt={img.alt} fill sizes="100vw" className="object-contain" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 p-4">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Vorheriges Bild"
              className="nora-nav-label border border-weiss/40 px-4 py-2 text-weiss hover:bg-weiss/10"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Nächstes Bild"
              className="nora-nav-label border border-weiss/40 px-4 py-2 text-weiss hover:bg-weiss/10"
            >
              ›
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
