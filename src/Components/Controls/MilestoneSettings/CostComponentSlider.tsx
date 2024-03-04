'use client'
import { Switch, Tooltip } from '@mantine/core'
import { ValueSlider } from '@/Components/Shared/ValueSlider'
import { QuestionMarkCircleIcon } from '@heroicons/react/16/solid'
import { Milestone, chartSettings } from '@/lib/chart-settings'
import {
  isUsingEvenDistribution,
  useIsEvenDistributionPreviouslySet
} from './milestoneTools'

export function CostComponentSlider({ milestone }: { milestone: Milestone }) {
  const { saveMilestone } = chartSettings()

  // disabled if using even distribution, or if any previous milestone is using even distribution
  const usingEvenDistribution = isUsingEvenDistribution(milestone)
  const previouslyDistributed = useIsEvenDistributionPreviouslySet(milestone)

  const distributionLabel = previouslyDistributed
    ? 'Even distribution has been set on a prior milestone. Costs in remaining milestones will be ignored.'
    : 'Distribute remaining costs evenly. Costs in remaining milestones will be ignored.'

  const showEvenDistribution =
    milestone.basis === 'costs' || milestone.milestoneNumber === 0

  return (
    <div className='flex flex-row items-end gap-2'>
      <div className='grow'>
        <ValueSlider
          className='grow'
          disabled={usingEvenDistribution || previouslyDistributed}
          value={milestone.costComponent}
          onChange={value => {
            saveMilestone({ ...milestone, costComponent: value })
          }}
          min={0}
          max={1}
          step={0.01}
          label={value => `${(value * 100).toFixed(0)}%`}
          title='Cost Component'
        />
      </div>
      {showEvenDistribution && (
        <div className='flex gap-1'>
          <Switch
            disabled={previouslyDistributed}
            checked={milestone.evenDistribution}
            onChange={event =>
              saveMilestone({
                ...milestone,
                evenDistribution: event.currentTarget.checked
              })
            }
          />
          <Tooltip label={distributionLabel}>
            <QuestionMarkCircleIcon className='w-4 text-gray-400' />
          </Tooltip>
        </div>
      )}
    </div>
  )
}
