import { times } from 'ramda'

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
