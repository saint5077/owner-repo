'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import type { TenantService } from '@/payload-types'
import { DraftBox } from '@/components/ui/DraftNotice'
import { Prose } from '@/components/ui/Prose'
import { FormStatusFooter, HoneypotField, SelectField, TextField, TextareaField } from '@/components/forms/Fields'
import { Turnstile } from '@/components/forms/Turnstile'
import { downscaleImage } from '@/lib/uploads/downscale'
import { schadenmeldungSchema, type SchadenmeldungInput } from '@/lib/forms/schemas'

import { submitSchadenmeldung } from './actions'

const SCHRITT_FELDER: (keyof SchadenmeldungInput)[][] = [
  ['notfall'],
  ['liegenschaftAdresse', 'wohnung'],
  ['kategorie', 'beschreibung'],
  [],
  ['erreichbarkeitTelefon', 'zutrittErlaubt', 'name', 'email'],
]

type FotoState = { localId: string; status: 'lädt' | 'fertig' | 'fehler'; key?: string; dateiname: string }

export function SchadenmeldungForm({
  notfallProse,
}: {
  notfallProse: TenantService['notfallText']
}) {
  const [schritt, setSchritt] = useState(0)
  const [serverError, setServerError] = useState<string | null>(null)
  const [referenznummer, setReferenznummer] = useState<string | null>(null)
  const [fotos, setFotos] = useState<FotoState[]>([])
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schadenmeldungSchema>, unknown, SchadenmeldungInput>({
    resolver: zodResolver(schadenmeldungSchema),
    defaultValues: { website: '', turnstileToken: '', fotoKeys: [] },
  })

  const notfall = watch('notfall')

  async function weiter() {
    const felder = SCHRITT_FELDER[schritt]
    const valid = felder.length === 0 || (await trigger(felder))
    if (valid) setSchritt((s) => Math.min(s + 1, SCHRITT_FELDER.length - 1))
  }
  function zurueck() {
    setSchritt((s) => Math.max(s - 1, 0))
  }

  async function handleFotoUpload(fileList: FileList | null) {
    if (!fileList) return
    const vorhandene = fotos.length
    const neueDateien = Array.from(fileList).slice(0, Math.max(0, 5 - vorhandene))
    const neueEintraege: FotoState[] = neueDateien.map((f) => ({
      localId: crypto.randomUUID(),
      status: 'lädt',
      dateiname: f.name,
    }))
    setFotos((prev) => [...prev, ...neueEintraege])

    for (let i = 0; i < neueDateien.length; i += 1) {
      const datei = neueDateien[i]
      const localId = neueEintraege[i].localId
      try {
        const verkleinert = await downscaleImage(datei)
        const formData = new FormData()
        formData.append('file', verkleinert)
        const res = await fetch('/api/uploads/schadenmeldung', { method: 'POST', body: formData })
        if (!res.ok) throw new Error('Upload fehlgeschlagen')
        const { id } = (await res.json()) as { id: string }
        setFotos((prev) => prev.map((f) => (f.localId === localId ? { ...f, status: 'fertig', key: id } : f)))
        setValue('fotoKeys', [...(watch('fotoKeys') ?? []), id])
      } catch {
        setFotos((prev) => prev.map((f) => (f.localId === localId ? { ...f, status: 'fehler' } : f)))
      }
    }
  }

  function fotoEntfernen(localId: string) {
    const foto = fotos.find((f) => f.localId === localId)
    setFotos((prev) => prev.filter((f) => f.localId !== localId))
    if (foto?.key) setValue('fotoKeys', (watch('fotoKeys') ?? []).filter((k) => k !== foto.key))
  }

  async function onSubmit(values: SchadenmeldungInput) {
    setServerError(null)
    const result = await submitSchadenmeldung(values)
    if (result.ok) setReferenznummer(result.referenznummer)
    else setServerError(result.message)
  }

  if (referenznummer) {
    return (
      <div role="status">
        <h2 className="nora-h2">Schaden gemeldet.</h2>
        <p className="nora-prose mt-3">
          Vielen Dank für Ihre Meldung. Wir melden uns in Kürze bei Ihnen. Ihre Referenznummer: <strong>{referenznummer}</strong>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-14">
      <HoneypotField registration={register('website')} />

      {/* Schritt 1 — Notfall */}
      <div className={schritt === 0 ? '' : 'hidden'}>
        <p className="nora-nav-label text-tinte-hell">1</p>
        <h2 className="nora-h2 mt-1">Notfall?</h2>
        <div className="nora-grid mt-6 gap-y-5">
          <div className="col-span-12 md:col-span-6">
            <SelectField
              label="Ist dies ein Notfall?"
              registration={register('notfall')}
              error={errors.notfall}
              options={[
                { value: 'nein', label: 'Nein' },
                { value: 'ja', label: 'Ja' },
              ]}
            />
          </div>
          {notfall === 'ja' ? (
            <div className="col-span-12">
              <DraftBox title="Notfall">
                <Prose data={notfallProse} className="text-[15px]" />
              </DraftBox>
            </div>
          ) : null}
          <div className="col-span-12">
            <StepNav onWeiter={weiter} />
          </div>
        </div>
      </div>

      {/* Schritt 2 — Liegenschaft und Wohnung */}
      <div className={schritt === 1 ? '' : 'hidden'}>
        <p className="nora-nav-label text-tinte-hell">2</p>
        <h2 className="nora-h2 mt-1">Liegenschaft und Wohnung</h2>
        <div className="nora-grid mt-6 gap-y-5">
          <div className="col-span-12 md:col-span-6">
            <TextField label="Liegenschaft (Adresse)" registration={register('liegenschaftAdresse')} error={errors.liegenschaftAdresse} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField label="Wohnung" registration={register('wohnung')} error={errors.wohnung} />
          </div>
          <div className="col-span-12">
            <StepNav onZurueck={zurueck} onWeiter={weiter} />
          </div>
        </div>
      </div>

      {/* Schritt 3 — Kategorie und Beschreibung */}
      <div className={schritt === 2 ? '' : 'hidden'}>
        <p className="nora-nav-label text-tinte-hell">3</p>
        <h2 className="nora-h2 mt-1">Kategorie und Beschreibung</h2>
        <div className="nora-grid mt-6 gap-y-5">
          <div className="col-span-12 md:col-span-6">
            <SelectField
              label="Kategorie"
              registration={register('kategorie')}
              error={errors.kategorie}
              options={[
                { value: 'sanitaer', label: 'Sanitär' },
                { value: 'heizung', label: 'Heizung' },
                { value: 'elektro', label: 'Elektro' },
                { value: 'kuecheGeraete', label: 'Küche/Geräte' },
                { value: 'fensterTueren', label: 'Fenster/Türen' },
                { value: 'lift', label: 'Lift' },
                { value: 'allgemeinflaechen', label: 'Allgemeinflächen' },
                { value: 'anderes', label: 'Anderes' },
              ]}
            />
          </div>
          <div className="col-span-12">
            <TextareaField label="Beschreibung" registration={register('beschreibung')} error={errors.beschreibung} />
          </div>
          <div className="col-span-12">
            <StepNav onZurueck={zurueck} onWeiter={weiter} />
          </div>
        </div>
      </div>

      {/* Schritt 4 — Fotos */}
      <div className={schritt === 3 ? '' : 'hidden'}>
        <p className="nora-nav-label text-tinte-hell">4</p>
        <h2 className="nora-h2 mt-1">Fotos</h2>
        <div className="nora-grid mt-6 gap-y-5">
          <div className="col-span-12">
            <label className="block">
              <span className="nora-nav-label mb-2 block text-tinte-hell">Fotos (bis zu 5, JPG/PNG/HEIC, je max. 8 MB)</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/heic"
                disabled={fotos.length >= 5}
                onChange={(e) => {
                  handleFotoUpload(e.target.files)
                  e.target.value = ''
                }}
                className="nora-prose w-full border border-sandstein/50 bg-weiss px-4 py-3 text-[15px]"
              />
            </label>
            {errors.fotoKeys ? <p className="nora-prose mt-1.5 text-[13px] text-[#E81D1B]">{errors.fotoKeys.message}</p> : null}
            {fotos.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-2">
                {fotos.map((f) => (
                  <li key={f.localId} className="nora-prose flex items-center justify-between gap-4 text-[14px]">
                    <span>
                      {f.dateiname} — {f.status === 'lädt' ? 'wird hochgeladen …' : f.status === 'fertig' ? 'hochgeladen' : 'Fehler beim Hochladen'}
                    </span>
                    <button type="button" onClick={() => fotoEntfernen(f.localId)} className="text-tinte-hell underline hover:text-fensterladen">
                      Entfernen
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="col-span-12">
            <StepNav onZurueck={zurueck} onWeiter={weiter} />
          </div>
        </div>
      </div>

      {/* Schritt 5 — Erreichbarkeit und Kontaktdaten */}
      <div className={schritt === 4 ? '' : 'hidden'}>
        <p className="nora-nav-label text-tinte-hell">5</p>
        <h2 className="nora-h2 mt-1">Erreichbarkeit und Kontaktdaten</h2>
        <div className="nora-grid mt-6 gap-y-5">
          <div className="col-span-12 md:col-span-6">
            <TextField label="Erreichbarkeit (Telefon)" type="tel" registration={register('erreichbarkeitTelefon')} error={errors.erreichbarkeitTelefon} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <SelectField
              label="Zutritt bei Abwesenheit erlaubt?"
              registration={register('zutrittErlaubt')}
              error={errors.zutrittErlaubt}
              options={[
                { value: 'nein', label: 'Nein' },
                { value: 'ja', label: 'Ja' },
              ]}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField label="Name" registration={register('name')} error={errors.name} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField label="E-Mail" type="email" registration={register('email')} error={errors.email} />
          </div>
          <div className="col-span-12">
            <Turnstile onToken={(token) => setValue('turnstileToken', token)} />
          </div>
          <div className="col-span-12">
            <StepNav onZurueck={zurueck} />
          </div>
          <FormStatusFooter pending={isSubmitting} success={null} error={serverError} />
        </div>
      </div>
    </form>
  )
}

function StepNav({ onZurueck, onWeiter }: { onZurueck?: () => void; onWeiter?: () => void }) {
  return (
    <div className="flex gap-4">
      {onZurueck ? (
        <button type="button" onClick={onZurueck} className="nora-button-label border border-sandstein/50 px-6 py-3 hover:border-tinte">
          Zurück
        </button>
      ) : null}
      {onWeiter ? (
        <button type="button" onClick={onWeiter} className="nora-button-label bg-fensterladen px-6 py-3 text-weiss hover:opacity-90">
          Weiter
        </button>
      ) : null}
    </div>
  )
}
