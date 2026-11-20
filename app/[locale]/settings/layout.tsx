import type React from 'react'

import { SidebarSection } from '@/components/app/settings/sidebar-section'
import { SplitLayout } from '@/components/split-layout'
import { requireSession } from '@/lib/auth'
import { LINKS } from '@/lib/link'

import type { LayoutProps } from '@/types/app/layout'

const Layout: React.FC<LayoutProps> = async ({
  children
}: LayoutProps): Promise<React.ReactNode> => {
  await requireSession(LINKS.settings.root)

  return <SplitLayout sidebar={<SidebarSection />}>{children}</SplitLayout>
}

export default Layout
