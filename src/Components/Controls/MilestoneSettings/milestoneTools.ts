import { Milestone, chartSettings } from '@/lib/chart-settings'

export const useIsEvenDistributionPreviouslySet = (milestone: Milestone) => {
  const { milestones } = chartSettings()
  return isEvenDistributionPreviouslySet(milestone, milestones)
}

export const isEvenDistributionPreviouslySet = (
  milestone: Milestone,
  milestones: Record<number, Milestone>
) =>
  !!Object.values(milestones).find(
    m => m.milestoneNumber < milestone.milestoneNumber && m.evenDistribution
  )
