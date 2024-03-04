'use client'
import { Milestones } from '../MilestoneSettings/Milestones'
import { VolumeSlider } from './VolumeSlider'
import { ItemPriceSlider } from './ItemPriceSlider'
import { ProjectCostsSlider } from './ProjectCostsSlider'

export function BaseSettings() {
  return (
    <div className='flex flex-col gap-5'>
      <VolumeSlider />
      <ItemPriceSlider />
      <ProjectCostsSlider />
      <Milestones />
      <div className='justify-cengter inline-flex h-32 w-32 items-center bg-pink-400 p-3 text-center text-white'>
        Box styled with tailwind
      </div>
    </div>
  )
}
