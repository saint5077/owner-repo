// Any setup scripts you might need go here

// Load .env files — explizit `.env.local`, da `dotenv/config` ohne Pfadangabe nur `.env` lädt
// (das es in diesem Projekt nicht gibt, siehe DECISIONS.md "Lokale Entwicklung"); ohne diesen
// Fix schlug `pnpm test:int` mit "missing secret key" fehl, da PAYLOAD_SECRET/DATABASE_URL nie
// geladen wurden — ein bereits vor Phase 6 bestehender Scaffold-Lücke, hier mitbehoben.
import { config } from 'dotenv'

config({ path: '.env.local' })
