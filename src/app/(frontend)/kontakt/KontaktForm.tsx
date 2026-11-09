'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { FormStatusFooter, HoneypotField, TextField, TextareaField } from '@/components/forms/Fields'
import { Turnstile } from '@/components/forms/Turnstile'
import { ANLIEGEN_VALUES, allgemeinSchema, type AllgemeinInput } from '@/lib/forms/schemas'

import { submitAllgemeineAnfrage } from './actions'

const ANLIEGEN_OPTIONS: { value: AllgemeinInput['anliegen']; label: string; hinweis: string }[] = [
  { value: 'verwaltung', label: 'Verwaltung', hinweis: 'Für Anfragen zur Bewirtschaftung Ihrer Liegenschaft.' },
  { value: 'stockwerkeigentum', label: 'Stockwerkeigentum', hinweis: 'Für Anfragen zur STWEG-Verwaltung.' },
  { value: 'erstvermietung', label: 'Erstvermietung', hinweis: 'Für die Vermietung einer Liegenschaft.' },
  { value: 'verkauf', label: 'Verkauf / Ersteinschätzung', hinweis: 'Für eine Ersteinschätzung zum Verkauf.' },
  { value: 'mieteranliegen', label: 'Mieteranliegen', hinweis: 'Für Schäden nutzen Sie bitte direkt die Schadenmeldung.' },
  { value: 'allgemein', label: 'Allgemein', hinweis: 'Für alle anderen Anliegen.' },
]

export function KontaktForm({ anliegenInitial }: { anliegenInitial?: string }) {
  const initial = ANLIEGEN_VALUES.includes(anliegenInitial as (typeof ANLIEGEN_VALUES)[number])
    ? (anliegenInitial as AllgemeinInput['anliegen'])
    : 'allgemein'

  const [serverError, setServerError] = useState<string | null>(null)
  const [referenznummer, setReferenznummer] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof allgemeinSchema>, unknown, AllgemeinInput>({
    resolver: zodResolver(allgemeinSchema),
    defaultValues: { anliegen: initial, website: '', turnstileToken: '' },
  })

  const aktuellesAnliegen = ANLIEGEN_OPTIONS.find((a) => a.value === watch('anliegen'))

  async function onSubmit(values: AllgemeinInput) {
    setServerError(null)
    const result = await submitAllgemeineAnfrage(values)
    if (result.ok) {
      setReferenznummer(result.referenznummer)
    } else {
      setServerError(result.message)
    }
  }

  if (referenznummer) {
    return (
      <div className="col-span-12" role="status">
        <h2 className="nora-h2">Nachricht gesendet.</h2>
        <p className="nora-prose mt-3">
          Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze bei Ihnen. Ihre Referenznummer:{' '}
          <strong>{referenznummer}</strong>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="nora-grid gap-y-5">
      <HoneypotField registration={register('website')} />
      <div className="col-span-12">
        <label className="block">
          <span className="nora-nav-label mb-2 block text-tinte-hell">Anliegen</span>
          <select
            className="nora-prose w-full border border-sandstein/50 bg-weiss px-4 py-3 text-[16px]"
            {...register('anliegen')}
          >
            {ANLIEGEN_OPTIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        {aktuellesAnliegen ? <p className="nora-prose mt-2 text-[14px] text-tinte-hell">{aktuellesAnliegen.hinweis}</p> : null}
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="Name" registration={register('name')} error={errors.name} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="Telefon" type="tel" registration={register('telefon')} error={errors.telefon} />
      </div>
      <div className="col-span-12">
        <TextField label="E-Mail" type="email" registration={register('email')} error={errors.email} />
      </div>
      <div className="col-span-12">
        <TextareaField label="Nachricht" registration={register('nachricht')} error={errors.nachricht} />
      </div>
      <div className="col-span-12">
        <Turnstile onToken={(token) => setValue('turnstileToken', token)} />
      </div>
      <FormStatusFooter pending={isSubmitting} success={null} error={serverError} />
    </form>
  )
}
