import type React from 'react'

import { LegalPage } from '@/components/app/legal/legal-page'
import { MetadataManager } from '@/lib/metadata-manager'
import { getTranslations } from 'next-intl/server'

import type { DynamicPageProps } from '@/types/app/page'
import type { Metadata } from 'next'

const TermsOfServicePage: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params

  const t = await getTranslations({ locale })

  return <LegalPage t={t} scope='legal.terms' />
}

export const metadata: Metadata = MetadataManager.generate(
  'Terms of Service',
  'The terms that govern your use of Trash and its connected services.'
)

export default TermsOfServicePage
