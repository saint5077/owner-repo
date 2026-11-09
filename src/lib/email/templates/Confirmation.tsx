import { EmailHeading, EmailLayout, EmailText } from './Layout'

/** Bestätigung an die absendende Person — Referenznummer, keine internen Details. */
export function ConfirmationEmail({ referenznummer }: { referenznummer: string }) {
  return (
    <EmailLayout preview={`Vielen Dank für Ihre Anfrage (${referenznummer})`}>
      <EmailHeading>Vielen Dank für Ihre Nachricht.</EmailHeading>
      <EmailText>Wir melden uns in Kürze bei Ihnen.</EmailText>
      <EmailText>
        Ihre Referenznummer: <strong>{referenznummer}</strong>
      </EmailText>
    </EmailLayout>
  )
}
