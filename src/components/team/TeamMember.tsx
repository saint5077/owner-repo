import Image from 'next/image'

import type { Team } from '@/payload-types'

/** Keine Rollenbezeichnung — auf der Live-Site nirgends bestätigt (DECISIONS.md #9). */
export function TeamMember({ member }: { member: Team }) {
  const foto = typeof member.foto === 'object' ? member.foto : null

  return (
    <div>
      <div className="aspect-[4/5] bg-sandstein/20">
        {foto?.url ? (
          <Image
            src={foto.url}
            alt={foto.alt ?? member.name}
            width={foto.width ?? 800}
            height={foto.height ?? 1000}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <p className="nora-h3 mt-4">{member.name}</p>
    </div>
  )
}
