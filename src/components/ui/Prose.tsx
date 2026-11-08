import { RichText } from '@payloadcms/richtext-lexical/react'

type ProseProps = {
  // Payload generiert pro Feld eine strukturell passende, aber nicht namentlich identische
  // Form von Lexicals `SerializedEditorState` — any hier ist eine bewusste Typgrenze zwischen
  // generiertem payload-types.ts und dem Lexical-Renderer, kein Versehen.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  className?: string
}

/** Rendert Payload-Richtext (Lexical) mit den Fliesstext-Tokens aus DESIGN.md §5. */
export function Prose({ data, className }: ProseProps) {
  if (!data) return null
  return <RichText data={data} className={['nora-prose', className].filter(Boolean).join(' ')} />
}
