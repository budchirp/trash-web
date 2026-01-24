import type React from 'react'

import { redirect } from 'next/navigation'

const Page: React.FC = (): React.ReactNode => {
  redirect('/settings/account')

  return <></>
}

export default Page
