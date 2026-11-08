import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'name'],
    description: 'Keine öffentliche Registrierung — Konten werden nur von Admins angelegt.',
  },
  auth: {
    // Login-Rate-Limit (Briefing §8)
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 Minuten
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'redaktion',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Redaktion', value: 'redaktion' },
      ],
    },
  ],
}
