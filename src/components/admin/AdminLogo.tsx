import React from 'react'

/**
 * Admin-Branding, Phase 2. Nutzt die bestehende 73×138-px-Rasterdatei (ausreichend für diese
 * kleine Darstellung) — wird in Phase 3 durch die SVG-Logo-Nachzeichnung ersetzt (DECISIONS.md).
 */
export const AdminLogo: React.FC = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img alt="Nora Immobilien" src="/branding/logo.png" style={{ height: 42, width: 'auto' }} />
)

export const AdminIcon: React.FC = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img alt="Nora Immobilien" src="/branding/logo.png" style={{ height: 24, width: 'auto' }} />
)
