'use client'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { Accordion, Select, TextInput } from '@mantine/core'
import { useMemo, useState } from 'react'
import {
  BasisOptions,
  ChartSettings,
  Milestone,
  basisOptions,
  chartSettings
} from '../../../lib/chart-settings'
import { ValueSlider } from '@/Components/Shared/ValueSlider'
import { AddMilestone } from './AddMilestone'
import { CostComponentSlider } from './CostComponentSlider'
import { MilestoneMenu } from './MilestoneMenu'
import { cn } from '@/lib/utils'

export function Milestones() {
  const { milestones } = chartSettings()
  const m = useMemo(() => Object.values(milestones), [milestones])
  const defaultMilestone = m[0]
  return (
    <div className='flex w-full flex-col gap-3'>
      <div className='flex justify-between'>
        <h2 className='text-lg font-semibold'>Milestone Settings</h2>
        <AddMilestone />
      </div>

      <Accordion
        radius={'md'}
        multiple
        maw={'100%'}
        transitionDuration={300}
        variant='contained'
        defaultValue={[
          `${defaultMilestone.milestoneNumber + 1}: ${defaultMilestone.label}`
        ]}
      >
        {Object.values(milestones).map(milestone => (
          <MilestoneItemSettings
            key={milestone.milestoneNumber}
            milestone={milestone}
          />
        ))}
      </Accordion>
    </div>
  )
}

function MilestoneItemSettings({ milestone }: { milestone: Milestone }) {
  const { saveMilestone } = chartSettings()
  const [editName, setEditName] = useState(false)

  const value = `${milestone.milestoneNumber + 1}: ${milestone.label}`

  const usingEvenDistribution =
    milestone.basis === 'costs' && milestone.evenDistribution

  if (!milestone) return null

  const isInitialMilestone = milestone.milestoneNumber === 0

  return (
    <Accordion.Item key={value} value={value}>
      <div className='flex w-full p-2'>
        <div className='flex grow items-center justify-between gap-2 font-bold'>
          <p
            className={cn(
              'm-1 max-w-64 shrink truncate',
              isInitialMilestone ? 'italic text-gray-600' : ''
            )}
          >
            {value}
          </p>
          <MilestoneMenu milestone={milestone} />
        </div>
        <Accordion.Control w='auto' />
      </div>
      <Accordion.Panel>
        <div className='flex flex-col gap-2'>
          {!isInitialMilestone && (
            <>
              <MilestoneBasisSettings
                milestone={milestone}
                updateMilestone={saveMilestone}
              />
            </>
          )}
          <hr />
          <div className='flex flex-col gap-2'>
            <CostComponentSlider milestone={milestone} />
          </div>
          <ValueSlider
            value={milestone.partnerShare}
            onChange={value => {
              saveMilestone({
                ...milestone,
                partnerShare: value,
                companyShare: 1 - value
              })
            }}
            min={0} // the total number of items minus
            max={1}
            step={0.01}
            label={value => `${(value * 100).toFixed(0)}%`}
            title='Partner Share'
          />
          <ValueSlider
            value={milestone.companyShare}
            label={value => `${(value * 100).toFixed(0)}%`}
            min={0}
            max={1}
            color='gray.4'
            title='Company Share'
          />
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  )
}

function MilestoneBasisSettings({
  milestone,
  updateMilestone
}: {
  milestone: Milestone
  updateMilestone: (value: Milestone) => void
}) {
  const settings = chartSettings()
  const [basisType, setBasisType] = useState(
    typeof milestone.basisPercentage === 'number' ? 'percentage' : 'fixed value'
  )

  const [valueMin, valueMax] = getMinMax(milestone, settings)

  return (
    <div className='flex flex-col gap-2'>
      <p className=' text-sm'>Milestone starting conditions</p>
      <div className='flex items-center gap-2'>
        <Select
          data={['percentage', 'fixed value']}
          value={basisType}
          onChange={value => {
            if (value) {
              setBasisType(value)
            }
          }}
        />
        <p className='shrink-0 text-sm'>of</p>
        <Select
          data={[...basisOptions]}
          value={milestone.basis}
          onChange={value => {
            if (value) {
              updateMilestone({ ...milestone, basis: value as BasisOptions })
            }
          }}
        />
      </div>
      <div className='flex flex-col gap-2'>
        {basisType === 'percentage' ? (
          <ValueSlider
            value={milestone.basisPercentage}
            label={value => `${(value * 100).toFixed(0)}%`}
            min={0}
            max={1}
            step={0.01}
            title={'Percentage'}
            onChange={value => {
              updateMilestone({
                ...milestone,
                basisTotal: undefined,
                basisPercentage: value
              })
            }}
          />
        ) : (
          <ValueSlider
            value={milestone.basisTotal}
            min={valueMin}
            max={valueMax}
            title='Set Value'
            onChange={value => {
              updateMilestone({
                ...milestone,
                basisPercentage: undefined,
                basisTotal: value
              })
            }}
          />
        )}
      </div>
    </div>
  )
}
function getMinMax(
  milestone: Milestone,
  settings: ChartSettings
): [number, number] {
  switch (milestone.basis) {
    case 'costs':
      return [0, settings.totalProjectCosts]
    case 'revenue':
      return [0, settings.salePrice * settings.numItemsToSell]
    case 'sales':
      return [0, settings.numItemsToSell]
    default:
      return [0, 0]
  }
}

// function MilestoneTools({ milestone }: { milestone: Milestone }) {
//   const isInitialMilestone = milestone.milestoneNumber === 0

//   return (
//     <div className='m-2 flex'>
//       {isInitialMilestone && (
//         <p className='grow text-end text-xs font-light italic text-gray-500'>
//           initial settings
//         </p>
//       )}
//     </div>
//   )
// }
