'use client'

import { useTranslations } from 'next-intl'
import { useLogout } from '@/lib/hooks/use-logout'
import { ConfirmationDialog } from './confirmation-dialog'

type LogoutDialogProps = {
  open: boolean
  onClose: () => void
}

export const LogoutDialog = ({ open, onClose }: LogoutDialogProps) => {
  const t = useTranslations('auth')
  const logout = useLogout()

  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      onConfirm={logout}
      title={t('logout')}
      description={t('logout_description')}
      confirmLabel={t('logout')}
    />
  )
}
