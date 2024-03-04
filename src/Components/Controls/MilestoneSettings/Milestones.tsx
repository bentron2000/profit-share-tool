'use client'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { Select, TextInput } from '@mantine/core'
import { useState } from 'react'
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

export function Milestones() {
  const { milestones } = chartSettings()
  return (
    <div className='flex w-full flex-col gap-3'>
      <div className='flex justify-between'>
        <h2 className='text-lg font-semibold'>Milestone Settings</h2>
        <AddMilestone />
      </div>
      {Object.values(milestones).map(milestone => (
        <MilestoneItemSettings
          key={milestone.milestoneNumber}
          milestone={milestone}
        />
      ))}
    </div>
  )
}
function MilestoneItemSettings({ milestone }: { milestone: Milestone }) {
  const { saveMilestone } = chartSettings()
  const [editName, setEditName] = useState(false)

  const usingEvenDistribution =
    milestone.basis === 'costs' && milestone.evenDistribution

  if (!milestone) return null

  const isInitialMilestone = milestone.milestoneNumber === 0

  return (
    <div
      className='flex flex-col gap-3 rounded-lg p-2 ring-1'
      key={milestone.milestoneNumber}
    >
      {!editName ? (
        <div className='flex items-center gap-2 font-bold'>
          <MilestoneMenu milestone={milestone} />
          <p className='max-w-44 truncate'>
            {`${milestone.milestoneNumber + 1}: ${milestone.label}`}
          </p>
          <PencilSquareIcon
            onClick={() => setEditName(true)}
            className=' w-4'
          />
          {isInitialMilestone && (
            <p className='grow text-end text-xs font-light italic text-gray-500'>
              initial settings
            </p>
          )}
        </div>
      ) : (
        <TextInput
          defaultValue={milestone.label}
          onBlur={event => {
            saveMilestone({ ...milestone, label: event.currentTarget.value })
            setEditName(false)
          }}
        />
      )}
      {!isInitialMilestone && (
        <>
          <MilestoneBasisSettings
            milestone={milestone}
            updateMilestone={saveMilestone}
          />
          <hr />
        </>
      )}
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
        title='Artist Share'
      />
      <ValueSlider
        value={milestone.companyShare}
        label={value => `${(value * 100).toFixed(0)}%`}
        min={0}
        max={1}
        color='gray.4'
        title='Moncoeur Share'
      />
    </div>
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
    <div>
      Milestone triggered at...
      <Select
        label='Milestone Basis'
        data={[...basisOptions]}
        value={milestone.basis}
        onChange={value => {
          if (value) {
            updateMilestone({ ...milestone, basis: value as BasisOptions })
          }
        }}
      />
      <>
        <Select
          label='as'
          data={['percentage', 'fixed value']}
          value={basisType}
          onChange={value => {
            if (value) {
              setBasisType(value)
            }
          }}
        />
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
      </>
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
