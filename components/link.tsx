import type React from 'react'

import { usePathname } from '@/lib/i18n/routing'
import Link from 'next/link'

import { Box, BoxContent, cn, Column, Row } from '@trash-kit/ui'

export type SelectableLinkProps = {
  label: string
  url: string

  box?: boolean
}

type SelectableLinksProps = {
  links: SelectableLinkProps[]
  box?: boolean
}

export const SelectableLink: React.FC<SelectableLinkProps> = ({
  label,
  url,
  box = false
}: SelectableLinkProps) => {
  const pathname = usePathname()

  const isSelected = url.length > 1 ? pathname.includes(url) : pathname === url

  return (
    <Link href={url}>
      <Box
        clickable={box}
        className={cn(
          'group cursor-pointer',
          !box && 'border-0 bg-transparent rounded-none',
          box && 'bg-surface-primary',
          box && isSelected && 'bg-surface-secondary border-outline-hover'
        )}
      >
        <BoxContent
          padding={box ? 'default' : 'none'}
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

export const SelectableLinks: React.FC<SelectableLinksProps> = ({ links, box = false }) => {
  if (!links.length) return null

  if (box) {
    return (
      <Column className='gap-2'>
        {links.map((link) => (
          <SelectableLink key={link.url} {...link} box />
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
