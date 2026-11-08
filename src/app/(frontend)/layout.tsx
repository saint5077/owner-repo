import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Nora Immobilien AG — Konzept-Vorschau (Phase 2: Backend-Grundlage, Design folgt in Phase 3).',
  title: 'Nora Immobilien AG',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="de-CH">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
