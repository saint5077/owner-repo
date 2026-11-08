import type { Access } from 'payload'

/** Eingeloggt, egal welche Rolle (admin oder redaktion). */
export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

/** Nur Rolle admin. */
export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

/**
 * Öffentlich lesbar nur, was veröffentlicht ist (Payload-Drafts/_status) — eingeloggte
 * Nutzer sehen auch Entwürfe (für Live Preview). Für Collections/Globals mit `versions.drafts`.
 */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

/** Für Collections ohne Draft-Konzept, die trotzdem öffentlich lesbar sein sollen. */
export const anyoneRead: Access = () => true

/**
 * Niemand darf über die öffentliche REST/Local-API ohne overrideAccess schreiben.
 * `submissions` und `searchAlerts` werden ausschliesslich über vertrauenswürdige Server
 * Actions angelegt (Payload Local API mit overrideAccess: true, Phase 6) — nie direkt vom
 * Client aus über die REST-API. So bleiben Validierung/Spam-Schutz erzwungen.
 */
export const nobodyCreate: Access = () => false
