import type React from 'react'

import { SignUpClientPage } from '@/app/[locale]/auth/signup/page.client'
import { getCookies } from 'next-client-cookies/server'
import { CONSTANTS } from '@/lib/constants'
import { publicRoute } from '@/lib/auth'

import { Column } from '@trash-kit/ui'

const SignUpPage: React.FC = async (): Promise<React.ReactNode> => {
  const cookies = await getCookies()
  const token = cookies.get(CONSTANTS.COOKIES.TOKEN)

  await publicRoute(token)

  return (
    <Column padding='page'>
      <SignUpClientPage />
    </Column>
  )
}

export default SignUpPage
