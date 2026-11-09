import { EmailHeading, EmailLayout, EmailMeta, EmailText } from './Layout'

export type NotificationField = { label: string; value: string }

/** Interne Benachrichtigung an die zuständige Empfänger-Adresse bei einer neuen Anfrage. */
export function NotificationEmail({
  titel,
  referenznummer,
  felder,
  nachricht,
}: {
  titel: string
  referenznummer: string
  felder: NotificationField[]
  nachricht?: string
}) {
  return (
    <EmailLayout preview={`Neue Anfrage: ${titel} (${referenznummer})`}>
      <EmailHeading>Neue Anfrage: {titel}</EmailHeading>
      <EmailText>Referenznummer {referenznummer}</EmailText>
      {felder.map((f) => (
        <EmailMeta key={f.label} label={f.label} value={f.value} />
      ))}
      {nachricht ? (
        <>
          <EmailText>
            <strong>Nachricht:</strong>
          </EmailText>
          <EmailText>{nachricht}</EmailText>
        </>
      ) : null}
    </EmailLayout>
  )
}
