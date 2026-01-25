import type React from 'react'
import type { ComponentProps } from 'react'

import { Column, Container, Heading, Text, cn } from '@trash-kit/ui'

export type VerticalPageProps = Omit<ComponentProps<'div'>, 'title'> & {
  title: React.ReactNode
  items: React.ReactNode[]
}

export const CenteredPage: React.FC<VerticalPageProps> = ({
  className,
  children,
  title,
  items,
  ...props
}: VerticalPageProps): React.ReactNode => (
  <Column padding='md' className='h-full'>
    <Container className='h-screen_'>
      <Column {...props} className={cn('size-full justify-center gap-4', className)}>
        <Column className='gap-2'>
          <Heading size='h1'>{title}</Heading>

          <Column className='gap-1'>
            {items.map((item, index) => (
              <Text className='text-text-secondary text-2xl font-medium' key={index}>
                {item}
              </Text>
            ))}
          </Column>
        </Column>

        {children && <Column className='gap-2'>{children}</Column>}
      </Column>
    </Container>
  </Column>
)
