import type { ReactNode } from 'react'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={['nora-container', className].filter(Boolean).join(' ')}>{children}</div>
}
