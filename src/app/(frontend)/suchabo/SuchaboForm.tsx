'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { CheckboxGroupField, FormStatusFooter, HoneypotField, SelectField, TextField } from '@/components/forms/Fields'
import { Turnstile } from '@/components/forms/Turnstile'
import { SUCHABO_KREISE, SUCHABO_OBJEKTARTEN, suchaboSchema, type SuchaboInput } from '@/lib/forms/schemas'

import { submitSuchabo } from './actions'

type Objektart = (typeof SUCHABO_OBJEKTARTEN)[number]
type Kreis = (typeof SUCHABO_KREISE)[number]

const OBJEKTART_LABEL: Record<Objektart, string> = {
  wohnung: 'Wohnung',
  maisonette: 'Maisonette',
  attika: 'Attika',
  studio: 'Studio',
  einfamilienhaus: 'Einfamilienhaus',
  reihenhaus: 'Reihenhaus',
  buero: 'Büro',
  gewerbe: 'Gewerbe',
}
const OBJEKTART_OPTIONS = SUCHABO_OBJEKTARTEN.map((value) => ({ value, label: OBJEKTART_LABEL[value] }))
const KREIS_OPTIONS = SUCHABO_KREISE.map((value) => ({ value, label: value }))

export function SuchaboForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof suchaboSchema>, unknown, SuchaboInput>({
    resolver: zodResolver(suchaboSchema),
    defaultValues: { website: '', turnstileToken: '', objektart: [], kreis: [] },
  })

  const objektart = (watch('objektart') ?? []) as Objektart[]
  const kreis = (watch('kreis') ?? []) as Kreis[]

  function toggleObjektart(value: Objektart) {
    const next = objektart.includes(value) ? objektart.filter((v) => v !== value) : [...objektart, value]
    setValue('objektart', next)
  }
  function toggleKreis(value: Kreis) {
    const next = kreis.includes(value) ? kreis.filter((v) => v !== value) : [...kreis, value]
    setValue('kreis', next)
  }

  async function onSubmit(values: SuchaboInput) {
    setServerError(null)
    const result = await submitSuchabo(values)
    if (result.ok) setSuccess(true)
    else setServerError(result.message)
  }

  if (success) {
    return (
      <div role="status">
        <h2 className="nora-h2">Fast geschafft.</h2>
        <p className="nora-prose mt-3">
          Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie Ihr Suchabo über den Link darin.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="nora-grid max-w-3xl gap-y-5">
      <HoneypotField registration={register('website')} />
      <div className="col-span-12 md:col-span-6">
        <SelectField
          label="Angebotsart"
          registration={register('angebotsart')}
          error={errors.angebotsart}
          options={[
            { value: 'miete', label: 'Mieten' },
            { value: 'kauf', label: 'Kaufen' },
            { value: 'beide', label: 'Beide' },
          ]}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="E-Mail" type="email" registration={register('email')} error={errors.email} />
      </div>
      <div className="col-span-12 md:col-span-4">
        <TextField label="Zimmer von" type="number" registration={register('zimmerVon')} error={errors.zimmerVon} />
      </div>
      <div className="col-span-12 md:col-span-4">
        <TextField label="Zimmer bis" type="number" registration={register('zimmerBis')} error={errors.zimmerBis} />
      </div>
      <div className="col-span-12 md:col-span-4">
        <TextField label="Preis bis (CHF)" type="number" registration={register('preisBis')} error={errors.preisBis} />
      </div>
      <div className="col-span-12">
        <CheckboxGroupField
          label="Objektart"
          options={OBJEKTART_OPTIONS}
          registration={(value) => ({
            checked: objektart.includes(value as Objektart),
            onChange: () => toggleObjektart(value as Objektart),
          })}
        />
      </div>
      <div className="col-span-12">
        <CheckboxGroupField
          label="Kreis"
          options={KREIS_OPTIONS}
          registration={(value) => ({
            checked: kreis.includes(value as Kreis),
            onChange: () => toggleKreis(value as Kreis),
          })}
        />
      </div>
      <div className="col-span-12">
        <Turnstile onToken={(token) => setValue('turnstileToken', token)} />
      </div>
      <FormStatusFooter pending={isSubmitting} success={null} error={serverError} />
    </form>
  )
}
