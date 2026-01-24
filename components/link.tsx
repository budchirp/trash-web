import type React from 'react'

import { usePathname } from '@/lib/i18n/routing'
import Link from 'next/link'

import { cn } from '@trash-kit/ui'

type SelectableLinkProps = {
  label: string
  url: string
}

export const SelectableLink: React.FC<SelectableLinkProps> = ({
  label,
  url
}: SelectableLinkProps) => {
  const pathname = usePathname()

  return (
    <Link
      className={cn(
        'hover:text-primary text-lg leading-6 transition-all duration-300 hover:font-bold',
        (url.length > 1 ? pathname.includes(url) : pathname === url)
          ? 'text-primary font-bold'
          : 'text-tertiary font-medium'
      )}
      href={url}
    >
      {label}
    </Link>
  )
}
