import { EmailButtonLink, EmailHeading, EmailLayout, EmailText } from './Layout'

export function SuchaboBestaetigenEmail({ bestaetigenUrl }: { bestaetigenUrl: string }) {
  return (
    <EmailLayout preview="Bitte bestätigen Sie Ihr Suchabo">
      <EmailHeading>Noch ein Klick für Ihr Suchabo</EmailHeading>
      <EmailText>
        Bitte bestätigen Sie Ihre E-Mail-Adresse, damit wir Sie benachrichtigen können, sobald ein passendes Objekt
        frei wird.
      </EmailText>
      <EmailButtonLink href={bestaetigenUrl}>Suchabo bestätigen</EmailButtonLink>
      <EmailText>Haben Sie das nicht angefordert, können Sie diese E-Mail einfach ignorieren.</EmailText>
    </EmailLayout>
  )
}

export function SuchaboAlertEmail({
  objektTitel,
  objektUrl,
  abmeldenUrl,
}: {
  objektTitel: string
  objektUrl: string
  abmeldenUrl: string
}) {
  return (
    <EmailLayout preview={`Neues Objekt passend zu Ihrem Suchabo: ${objektTitel}`}>
      <EmailHeading>Ein passendes Objekt ist frei geworden</EmailHeading>
      <EmailText>{objektTitel}</EmailText>
      <EmailButtonLink href={objektUrl}>Objekt ansehen</EmailButtonLink>
      <EmailText style={{ fontSize: 13 }}>
        <a href={abmeldenUrl}>Suchabo abmelden</a>
      </EmailText>
    </EmailLayout>
  )
}
