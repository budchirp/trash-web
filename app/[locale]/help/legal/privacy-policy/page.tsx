import type React from 'react'

import { LegalPage } from '@/components/app/legal/legal-page'
import { createMetadata } from '@/lib/metadata'
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

const PrivacyPolicyPage: React.FC = async (): Promise<React.ReactNode> => {
  const t = await getTranslations()

  return <LegalPage t={t} scope='legal.privacy' />
}

export const metadata: Metadata = createMetadata(
  'Privacy Policy',
  'How Trash collects, uses, and protects your personal information.'
)

export default PrivacyPolicyPage
