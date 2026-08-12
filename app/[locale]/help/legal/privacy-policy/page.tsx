import type React from 'react'

import { LegalPage } from '@/components/app/legal/legal-page'
import { MetadataManager } from '@/lib/metadata-manager'
import { getTranslations } from 'next-intl/server'

import type { DynamicPageProps } from '@/types/app/page'
import type { Metadata } from 'next'

const PrivacyPolicyPage: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params

  const t = await getTranslations({ locale })

  return <LegalPage t={t} scope='legal.privacy' />
}

export const metadata: Metadata = MetadataManager.generate(
  'Privacy Policy',
  'How Trash collects, uses, and protects your personal information.'
)

export default PrivacyPolicyPage
