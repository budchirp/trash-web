'use client'

import type React from 'react'

import { Link, usePathname } from '@/lib/i18n/navigation'

import { Box, BoxContent, cn, Column, Row } from '@trash-kit/ui'

export type SelectableLinkProps = {
  label: string
  url: string

  box?: boolean
  color?: 'primary' | 'secondary'
}

type SelectableLinksProps = {
  links: SelectableLinkProps[]
  box?: boolean
  color?: 'primary' | 'secondary'
}

export const SelectableLink: React.FC<SelectableLinkProps> = ({
  label,
  url,
  box = false,
  color = 'primary'
}: SelectableLinkProps) => {
  const pathname = usePathname()

  const isSelected = pathname === url || pathname.startsWith(`${url}/`)

  return (
    <Link href={url}>
      <Box
        color={color}
        clickable={box}
        className={cn(
          'group cursor-pointer',
          !box && 'border-0 bg-transparent rounded-none',
          box && isSelected && 'bg-surface-secondary border-outline-hover'
        )}
      >
        <BoxContent
          padding={box ? 'md' : 'none'}
          className={cn(
            'text-lg text-content-primary',
            !box && 'text-content-tertiary hover:text-content-primary',
            box && 'leading-4 text-content-primary',
            !box && isSelected && 'underline text-content-primary',
            isSelected ? 'font-bold' : 'font-medium'
          )}
        >
          {label}
        </BoxContent>
      </Box>
    </Link>
  )
}

export const SelectableLinks: React.FC<SelectableLinksProps> = ({
  links,
  box = false,
  color = 'primary'
}) => {
  if (!links.length) return null

  if (box) {
    return (
      <Column className='gap-2'>
        {links.map((link) => (
          <SelectableLink key={link.url} {...link} box color={color} />
        ))}
      </Column>
    )
  }

  return (
    <Row className='flex-row-reverse gap-2'>
      {links.map((link) => (
        <SelectableLink key={link.url} {...link} />
      ))}
    </Row>
  )
}
