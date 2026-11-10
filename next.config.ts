import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/branding/**',
      },
    ],
  },
  // Mehrere Root-Layouts ((frontend)/(payload)) — global-not-found.tsx übernimmt das 404 für
  // URLs, die keiner Gruppe zuzuordnen sind (siehe Kommentar dort). Phase 7 baut die restlichen
  // 301-Redirects der alten Wix-Sitemap aus; dieser eine ist schon jetzt ein Einzeiler wert.
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    return [{ source: '/rechtliche-hinweise', destination: '/impressum', permanent: true }]
  },
  // Teil 2 von 3 des "dreifachen noindex" im Demo-Modus (DECISIONS.md #54) — Teil 1 ist der
  // Meta-Tag aus den `metadata.robots`-Exporten der Root-Layouts (erzeugt keinen Header), Teil 3
  // ist robots.ts. Dieselbe fail-safe-Logik: ohne gesetzte Variable gilt Demo-Modus.
  async headers() {
    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'
    if (!isDemo) return []
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
