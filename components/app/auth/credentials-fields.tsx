import { useTranslations } from 'next-intl'
import { Column, Field, Input, Label } from '@trash-kit/ui'
import type { UseFormRegisterReturn } from 'react-hook-form'

type CredentialField = {
  name: 'email' | 'username' | 'password'
  registration: UseFormRegisterReturn
  error?: string
}

type CredentialsFieldsProps = {
  fields: CredentialField[]
  disabled: boolean
}

export const CredentialsFields = ({ fields, disabled }: CredentialsFieldsProps) => {
  const t = useTranslations('auth.form')
  const common = useTranslations('common')

  return (
    <Column className='gap-2'>
      {fields.map(({ name, registration, error }) => (
        <Field key={name} name={name} error={error}>
          <Label>{t(name)}:</Label>
          <Input
            placeholder={common('enter_field', { field: t(name) })}
            type={name === 'username' ? 'text' : name}
            disabled={disabled}
            {...registration}
          />
        </Field>
      ))}
    </Column>
  )
}
