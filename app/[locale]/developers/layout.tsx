import type React from 'react'

import { DevelopersSidebarSection } from '@/components/app/developers/sidebar-section'
import { SplitLayout } from '@/components/split-layout'

import type { LayoutProps } from '@/types/app/layout'

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps): React.ReactNode => (
  <SplitLayout sidebar={<DevelopersSidebarSection />}>{children}</SplitLayout>
)

export default Layout
