import React from 'react'

import { Logo } from '@/components/branding/Logo'

/**
 * Admin-Branding. Nutzt ab Phase 3 die SVG-Logo-Nachzeichnung (siehe Logo.tsx, DESIGN.md §2)
 * statt der alten 73×138-px-Rasterdatei — DECISIONS.md #16.
 */
export const AdminLogo: React.FC = () => <Logo style={{ height: 42, width: 'auto' }} />

export const AdminIcon: React.FC = () => <Logo style={{ height: 24, width: 'auto' }} />
