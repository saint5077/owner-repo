import { Body, Container, Head, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { CSSProperties, ReactNode } from 'react'

const COLORS = {
  kalk: '#EEF0EA',
  tinte: '#1E2B24',
  tinteHell: '#545B50',
  sandstein: '#9AA08E',
  fensterladen: '#2F5B45',
  weiss: '#FFFFFF',
}

/** E-Mail-Variante des Designsystems (DESIGN.md §4/§5) — Web-Fonts laden in E-Mail-Clients nicht
 * zuverlässig, daher eine seriöse, serifenlose Systemschrift-Kette statt Archivo/Literata, aber
 * dieselbe Farbpalette und ruhige, unaufdringliche Gestaltung wie die Website. */
export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="de-CH">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: COLORS.kalk, fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '32px 16px' }}>
        <Container style={{ backgroundColor: COLORS.weiss, maxWidth: 560, padding: '32px 36px', border: `1px solid ${COLORS.sandstein}4D` }}>
          <Text style={{ fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', color: COLORS.tinteHell, margin: '0 0 24px' }}>
            Nora Immobilien AG
          </Text>
          {children}
          <Hr style={{ borderColor: `${COLORS.sandstein}4D`, margin: '32px 0 16px' }} />
          <Text style={{ fontSize: 12, color: COLORS.tinteHell, margin: 0 }}>
            Nora Immobilien AG · Langstrasse 14 · 8004 Zürich · +41 44 495 70 70
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export function EmailHeading({ children }: { children: ReactNode }) {
  return <Text style={{ fontSize: 22, fontWeight: 700, color: COLORS.tinte, margin: '0 0 16px', lineHeight: 1.25 }}>{children}</Text>
}

export function EmailText({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <Text style={{ fontSize: 15, color: COLORS.tinte, lineHeight: 1.6, margin: '0 0 12px', ...style }}>{children}</Text>
}

export function EmailButtonLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Section style={{ margin: '20px 0' }}>
      <a
        href={href}
        style={{
          backgroundColor: COLORS.fensterladen,
          color: COLORS.weiss,
          fontSize: 15,
          fontWeight: 600,
          padding: '12px 24px',
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        {children}
      </a>
    </Section>
  )
}

export function EmailMeta({ label, value }: { label: string; value: string }) {
  return (
    <Text style={{ fontSize: 14, color: COLORS.tinteHell, margin: '0 0 4px' }}>
      <strong style={{ color: COLORS.tinte }}>{label}:</strong> {value}
    </Text>
  )
}
