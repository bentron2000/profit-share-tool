import { times } from 'ramda'

import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dumbRandomIdGenerator() {
  const length = 10

  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  const charactersLength = characters.length

  const result: string[] = []

  times(
    () =>
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      ),
    length
  )

  return result.join('')
}
