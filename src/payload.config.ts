import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Downloads } from './collections/Downloads'
import { Jobs } from './collections/Jobs'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Properties } from './collections/Properties'
import { SearchAlerts } from './collections/SearchAlerts'
import { Services } from './collections/Services'
import { Submissions } from './collections/Submissions'
import { Team } from './collections/Team'
import { Users } from './collections/Users'
import { About } from './globals/About'
import { Home } from './globals/Home'
import { Legal } from './globals/Legal'
import { SiteSettings } from './globals/SiteSettings'
import { TenantService } from './globals/TenantService'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Nora Immobilien',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/AdminLogo#AdminLogo',
        Icon: '@/components/admin/AdminLogo#AdminIcon',
      },
    },
  },
  i18n: {
    supportedLanguages: { de, en },
    fallbackLanguage: 'de',
  },
  collections: [Users, Media, Team, Properties, Services, Downloads, Posts, Jobs, Submissions, SearchAlerts],
  globals: [SiteSettings, Home, About, TenantService, Legal],
  localization: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  // GraphQL-Endpunkt deaktiviert — Frontend nutzt REST/Local API (Briefing §8).
  graphQL: {
    disable: true,
  },
  sharp,
  plugins: [],
})
