import type { ReactNode } from 'react'

import { cn } from '@trash-kit/ui'

export type DetailRow = {
  label: string
  value: ReactNode
}

type DetailsTableProps = {
  rows: DetailRow[]
  variant?: 'background' | 'plain'
}

export const DetailsTable = ({ rows, variant = 'background' }: DetailsTableProps) => (
  <dl
    className={cn(
      'w-full',
      variant === 'plain'
        ? 'flex flex-col gap-2'
        : 'overflow-hidden rounded-2xl border border-outline bg-surface-primary'
    )}
  >
    {rows.map(({ label, value }) => (
      <div
        key={label}
        className={cn(
          'grid grid-cols-1 gap-1 sm:grid-cols-[1fr_2fr] sm:gap-4',
          variant === 'background' && 'px-4 py-3 even:bg-surface-secondary'
        )}
      >
        <dt className='font-medium text-content-secondary'>{label}</dt>

        <dd className='min-w-0 break-words text-content-primary'>{value}</dd>
      </div>
    ))}
  </dl>
)
