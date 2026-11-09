export function SkipLink({ locale = 'de' }: { locale?: 'de' | 'en' }) {
  return (
    <a href="#hauptinhalt" className="nora-skip-link">
      {locale === 'en' ? 'Skip to main content' : 'Zum Hauptinhalt springen'}
    </a>
  )
}
