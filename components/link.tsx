import type React from 'react'

import { usePathname } from '@/lib/i18n/routing'
import Link from 'next/link'

import { Box, BoxContent, cn } from '@trash-kit/ui'

type SelectableLinkProps = {
  label: string
  url: string

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
