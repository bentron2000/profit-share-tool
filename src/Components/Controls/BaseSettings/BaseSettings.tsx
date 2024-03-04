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
    </div>
  )
}
