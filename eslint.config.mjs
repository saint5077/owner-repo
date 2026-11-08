import nextPlugin from '@next/eslint-plugin-next'
import tseslint from 'typescript-eslint'

// Bewusst ohne @eslint/eslintrc/FlatCompat: die Kombination aus ESLint 9.39.x und den aktuellen
// eslint-plugin-react-Flat-Configs löst dort eine zirkuläre Referenz beim Fehler-Reporting aus
// (eslint-config-next 16.3.3 liefert inzwischen ohnehin native Flat Configs über
// @next/eslint-plugin-next, FlatCompat ist für diesen Fall nicht mehr nötig).
const eslintConfig = [
  nextPlugin.configs['core-web-vitals'],
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    ignores: ['.next/', 'src/payload-types.ts', 'src/payload-generated-schema.ts'],
  },
]

export default eslintConfig
