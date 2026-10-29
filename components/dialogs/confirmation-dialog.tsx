'use client'

import { useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Dialog, DialogActions, DialogContent, Heading, Text, toast } from '@trash-kit/ui'

type ConfirmationDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onClose: () => void
  onConfirm: () => Promise<boolean | undefined>
}

export const ConfirmationDialog = ({
  open,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm
}: ConfirmationDialogProps) => {
  const t = useTranslations('common')
  const id = useId()
  const busy = useRef(false)
  const [pending, setPending] = useState(false)

  const confirm = async () => {
    if (busy.current) return
    busy.current = true
    setPending(true)
    try {
      if ((await onConfirm()) !== false) onClose()
    } catch {
      toast(t('error'), { color: 'danger' })
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!busy.current) onClose()
      }}
      role='alertdialog'
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <DialogContent>
        <Heading id={`${id}-title`} size='h3'>
          {title}
        </Heading>
        <Text id={`${id}-description`}>{description}</Text>
      </DialogContent>
      <DialogActions>
        <Button type='button' color='secondary' disabled={pending} onClick={onClose} autoFocus>
          {t('cancel')}
        </Button>
        <Button
          type='button'
          color='danger'
          disabled={pending}
          loading={pending}
          onClick={() => void confirm()}
        >
          {confirmLabel ?? t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
