import { getTranslations } from 'next-intl/server'

import { Section } from '@trash-kit/ui'
import { SelectableLinks } from '@/components/link'
import { SplitLayout } from '@/components/split-layout'
import { getDevelopersLinks } from '@/lib/link'

import type { LayoutProps } from '@/types/app/layout'

export default async function Layout({ children }: LayoutProps) {
  const t = await getTranslations()

  return (
    <SplitLayout
      sidebar={
        <Section title={t('developers.title')}>
          <SelectableLinks box links={getDevelopersLinks(t)} />
        </Section>
      }
    >
      {children}
    </SplitLayout>
  )
}
