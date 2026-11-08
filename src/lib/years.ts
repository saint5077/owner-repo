const GRUENDUNGSJAHR = 1979

/**
 * Serverseitig berechnet statt fest eingetragen ("45 Jahre" war auf der alten Seite veraltet —
 * siehe DECISIONS.md #11). Betroffene Routen zusätzlich mit `export const revalidate = 86400`
 * versehen, damit sich die Zahl auch ohne CMS-Änderung am 1. Januar automatisch korrigiert.
 */
export function getJahreSeitGruendung(): number {
  return new Date().getFullYear() - GRUENDUNGSJAHR
}
