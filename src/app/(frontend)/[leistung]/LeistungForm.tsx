'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { FormStatusFooter, HoneypotField, SelectField, TextField, TextareaField } from '@/components/forms/Fields'
import { Turnstile } from '@/components/forms/Turnstile'
import {
  ersteinschaetzungSchema,
  verwaltungSchema,
  type ErsteinschaetzungInput,
  type VerwaltungInput,
} from '@/lib/forms/schemas'

import { submitErsteinschaetzung, submitVerwaltung } from './actions'

function VerwaltungFormBody() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [referenznummer, setReferenznummer] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof verwaltungSchema>, unknown, VerwaltungInput>({
    resolver: zodResolver(verwaltungSchema),
    defaultValues: { website: '', turnstileToken: '' },
  })

  async function onSubmit(values: VerwaltungInput) {
    setServerError(null)
    const result = await submitVerwaltung(values)
    if (result.ok) setReferenznummer(result.referenznummer)
    else setServerError(result.message)
  }

  if (referenznummer) return <FormErfolg referenznummer={referenznummer} />

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="nora-grid gap-y-5">
      <HoneypotField registration={register('website')} />
      <div className="col-span-12 md:col-span-6">
        <SelectField
          label="Art der Liegenschaft"
          registration={register('artDerLiegenschaft')}
          error={errors.artDerLiegenschaft}
          options={[
            { value: 'mehrfamilienhaus', label: 'Mehrfamilienhaus' },
            { value: 'stockwerkeigentum', label: 'Stockwerkeigentum' },
            { value: 'gemischt', label: 'Gemischt genutzt' },
            { value: 'gewerbe', label: 'Gewerbe' },
            { value: 'einfamilienhaus', label: 'Einfamilienhaus' },
          ]}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="Anzahl Einheiten" type="number" registration={register('anzahlEinheiten')} error={errors.anzahlEinheiten} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="Ort" registration={register('ort')} error={errors.ort} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <SelectField
          label="Heutige Situation"
          registration={register('heutigeSituation')}
          error={errors.heutigeSituation}
          options={[
            { value: 'selbstVerwaltet', label: 'Selbst verwaltet' },
            { value: 'andereVerwaltung', label: 'Andere Verwaltung' },
            { value: 'neubau', label: 'Neubau' },
          ]}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="Gewünschter Beginn" type="date" registration={register('gewuenschterBeginn')} error={errors.gewuenschterBeginn} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="Rückruf-Zeitfenster" registration={register('rueckrufZeitfenster')} error={errors.rueckrufZeitfenster} />
      </div>
      <KontaktfelderUndNachricht register={register} errors={errors} />
      <div className="col-span-12">
        <Turnstile onToken={(token) => setValue('turnstileToken', token)} />
      </div>
      <FormStatusFooter pending={isSubmitting} success={null} error={serverError} />
    </form>
  )
}

function ErsteinschaetzungFormBody() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [referenznummer, setReferenznummer] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof ersteinschaetzungSchema>, unknown, ErsteinschaetzungInput>({
    resolver: zodResolver(ersteinschaetzungSchema),
    defaultValues: { website: '', turnstileToken: '' },
  })

  async function onSubmit(values: ErsteinschaetzungInput) {
    setServerError(null)
    const result = await submitErsteinschaetzung(values)
    if (result.ok) setReferenznummer(result.referenznummer)
    else setServerError(result.message)
  }

  if (referenznummer) return <FormErfolg referenznummer={referenznummer} />

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="nora-grid gap-y-5">
      <HoneypotField registration={register('website')} />
      <div className="col-span-12 md:col-span-6">
        <SelectField
          label="Objektart"
          registration={register('objektart')}
          error={errors.objektart}
          options={[
            { value: 'eigenheim', label: 'Eigenheim' },
            { value: 'renditeliegenschaft', label: 'Renditeliegenschaft' },
            { value: 'stockwerkeinheit', label: 'Stockwerkeinheit' },
            { value: 'gewerbeIndustrieobjekt', label: 'Gewerbe-/Industrieobjekt' },
          ]}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TextField label="Ort" registration={register('ort')} error={errors.ort} />
      </div>
      <div className="col-span-12 md:col-span-4">
        <TextField label="Zimmer" type="number" registration={register('zimmer')} error={errors.zimmer} />
      </div>
      <div className="col-span-12 md:col-span-4">
        <TextField label="Fläche (m²)" type="number" registration={register('flaeche')} error={errors.flaeche} />
      </div>
      <div className="col-span-12 md:col-span-4">
        <TextField label="Baujahr" type="number" registration={register('baujahr')} error={errors.baujahr} />
      </div>
      <div className="col-span-12">
        <TextField label="Zustand" registration={register('zustand')} error={errors.zustand} />
      </div>
      <div className="col-span-12">
        <SelectField
          label="Zeithorizont"
          registration={register('zeithorizont')}
          error={errors.zeithorizont}
          options={[
            { value: 'sofort', label: 'So bald wie möglich' },
            { value: 'sechsMonate', label: 'In den nächsten 6 Monaten' },
            { value: 'offen', label: 'Noch offen' },
          ]}
        />
      </div>
      <KontaktfelderUndNachricht register={register} errors={errors} />
      <div className="col-span-12">
        <Turnstile onToken={(token) => setValue('turnstileToken', token)} />
      </div>
      <FormStatusFooter pending={isSubmitting} success={null} error={serverError} />
    </form>
  )
}

// Name/Telefon/E-Mail/Nachricht sind in beiden Formularen identisch benannt — ein `any` auf
// `register`/`errors` hier ist bewusst, da RHF-Typen zwischen den beiden Schemas sonst nicht
// strukturell kompatibel sind, obwohl die Feldnamen es sind.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function KontaktfelderUndNachricht({ register, errors }: { register: any; errors: any }) {
  return (
    <>
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
    </>
  )
}

function FormErfolg({ referenznummer }: { referenznummer: string }) {
  return (
    <div className="col-span-12" role="status">
      <h2 className="nora-h2">Anfrage gesendet.</h2>
      <p className="nora-prose mt-3">
        Vielen Dank für Ihre Anfrage. Wir melden uns in Kürze bei Ihnen. Ihre Referenznummer: <strong>{referenznummer}</strong>
      </p>
    </div>
  )
}

export function LeistungForm({ variant }: { variant: 'verwaltung' | 'ersteinschaetzung' }) {
  return variant === 'ersteinschaetzung' ? <ErsteinschaetzungFormBody /> : <VerwaltungFormBody />
}
