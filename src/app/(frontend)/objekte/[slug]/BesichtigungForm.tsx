'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { FormStatusFooter, HoneypotField, SelectField, TextField, TextareaField } from '@/components/forms/Fields'
import { Turnstile } from '@/components/forms/Turnstile'
import { besichtigungSchema, type BesichtigungInput } from '@/lib/forms/schemas'

import { submitBesichtigung } from './actions'

export function BesichtigungForm({ propertySlug }: { propertySlug: string }) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [referenznummer, setReferenznummer] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof besichtigungSchema>, unknown, BesichtigungInput>({
    resolver: zodResolver(besichtigungSchema),
    defaultValues: { propertySlug, website: '', turnstileToken: '' },
  })

  async function onSubmit(values: BesichtigungInput) {
    setServerError(null)
    const result = await submitBesichtigung(values)
    if (result.ok) setReferenznummer(result.referenznummer)
    else setServerError(result.message)
  }

  if (referenznummer) {
    return (
      <div role="status">
        <h2 className="nora-h2">Anfrage gesendet.</h2>
        <p className="nora-prose mt-3">
          Vielen Dank für Ihre Anfrage. Wir melden uns in Kürze bei Ihnen. Ihre Referenznummer: <strong>{referenznummer}</strong>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="nora-grid max-w-3xl gap-y-5">
      <HoneypotField registration={register('website')} />
      <div className="col-span-12 md:col-span-6">
        <TextField label="Name" registration={register('name')} error={errors.name} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="Telefon" type="tel" registration={register('telefon')} error={errors.telefon} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="E-Mail" type="email" registration={register('email')} error={errors.email} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <SelectField
          label="Anzahl Personen"
          registration={register('anzahlPersonen')}
          error={errors.anzahlPersonen}
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4+', label: '4+' },
          ]}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="Wunschtermin 1" type="datetime-local" registration={register('wunschtermin1')} error={errors.wunschtermin1} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="Wunschtermin 2" type="datetime-local" registration={register('wunschtermin2')} error={errors.wunschtermin2} />
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
