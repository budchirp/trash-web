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
        className={cn(
          'bg-transparent group border-transparent',
          !box && 'border-0',
          box && !isSelected && 'hover:bg-surface-primary hover:border-outline-hover',
          box && isSelected && 'bg-surface-primary border-outline'
        )}
      >
        <BoxContent
          padding={box ? 'default' : 'none'}
          className={cn(
            'text-lg',
            box && 'leading-4',
            isSelected
              ? 'text-primary font-bold'
              : 'text-tertiary font-medium group-hover:text-primary group-hover:font-bold'
          )}
        >
          {label}
        </BoxContent>
      </Box>
    </Link>
  )
}
