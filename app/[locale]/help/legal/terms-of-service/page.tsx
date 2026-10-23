import type React from 'react'

import { LegalPage } from '@/components/app/legal/legal-page'
import { createMetadata } from '@/lib/metadata'
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

const TermsOfServicePage: React.FC = async (): Promise<React.ReactNode> => {
  const t = await getTranslations()

  return <LegalPage t={t} scope='legal.terms' />
}

export const metadata: Metadata = createMetadata(
  'Terms of Service',
  'The terms that govern your use of Trash and its connected services.'
)

export default TermsOfServicePage
