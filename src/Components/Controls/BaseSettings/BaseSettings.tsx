'use client'
import { Milestones } from '../MilestoneSettings/Milestones'
import { VolumeSlider } from './VolumeSlider'
import { ItemPriceSlider } from './ItemPriceSlider'
import { ProjectCostsSlider } from './ProjectCostsSlider'
import { AllCostsRecoupedBySlider } from './AllCostsRecoupedBySlider'

export function BaseSettings() {
  return (
    <div className='flex flex-col gap-10'>
      <VolumeSlider />
      <ItemPriceSlider />
      <ProjectCostsSlider />
      <AllCostsRecoupedBySlider />
      <Milestones />
    </div>
  )
}
