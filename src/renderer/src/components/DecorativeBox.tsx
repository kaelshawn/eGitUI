import { Center } from 'rsuite'
import type { ComponentProps, ReactNode } from 'react'

type DecorativeBoxProps = {
  children?: ReactNode
} & ComponentProps<typeof Center>

export function DecorativeBox({ children, ...rest }: DecorativeBoxProps): React.JSX.Element {
  return (
    <Center bg="var(--rs-placeholder)" p={20} my={6} rounded="lg" {...rest}>
      {children}
    </Center>
  )
}
