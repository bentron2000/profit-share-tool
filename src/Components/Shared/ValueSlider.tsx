'use client'
import { Slider } from '@mantine/core'

export function ValueSlider({
  title,
  ...props
}: Parameters<typeof Slider>[0] & { title: string }) {
  return (
    <div className='flex flex-col gap-2'>
      <div className='text-sm'>{title}</div>
      <Slider {...props} />
    </div>
  )
}
