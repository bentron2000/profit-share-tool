'use client'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { Select, Slider, Switch, TextInput } from '@mantine/core'
import { useState } from 'react'
import {
  BasisOptions,
  ChartSettings,
  Milestone,
  basisOptions,
  chartSettings
} from '../_data/chart-settings'
export default function ControlsPage() {
  const {
    editionSize,
    setEditionSize,
    salePrice,
    setSalePrice,
    editionCosts,
    setEditionCosts,
    allCostsRecoupedBy,
    setallCostsRecoupedBy,
    milestones
  } = chartSettings()

  return (
    <div className='h-screen overflow-scroll'>
      <div className='flex flex-col gap-5  p-3'>
        <p className='text-xl font-bold'>Controls</p>
        <div className='flex flex-col gap-10'>
          <ValueSlider
            value={editionSize}
            onChange={setEditionSize}
            title='Edition Size'
            min={100}
            max={1000}
          />
          <ValueSlider
            value={salePrice}
            onChange={setSalePrice}
            min={10}
            max={100}
            title='Sale Price'
          />
          <ValueSlider
            value={editionCosts}
            onChange={setEditionCosts}
            min={100}
            max={10000}
            title='Cost base'
            label={value => `$${new Intl.NumberFormat('en-AU').format(value)}`}
          />
          <ValueSlider
            value={allCostsRecoupedBy}
            onChange={setallCostsRecoupedBy}
            min={0} // the total number of items minus
            max={editionSize}
            step={1}
            title='Recoup all costs by sale #'
          />
          <div className='flex flex-col gap-3'>
            Milestone Settings
            {Array.from(milestones.values()).map(milestone => (
              <MilestoneSettings
                key={milestone.milestoneNumber}
                milestone={milestone}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ValueSlider({
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

function MilestoneSettings({ milestone }: { milestone: Milestone }) {
  const { saveMilestone } = chartSettings()
  const [editName, setEditName] = useState(false)

  const usingEvenDistribution =
    milestone.basis === 'costs' && milestone.evenDistribution

  const updateMilestone = (value: Partial<Milestone>) => {
    saveMilestone({ ...milestone, ...value } as Milestone)
  }

  if (!milestone) return null

  return (
    <div
      className='flex flex-col gap-3 rounded-lg p-2 ring-1'
      key={milestone.milestoneNumber}
    >
      {!editName ? (
        <div className='flex items-center gap-2 font-bold'>
          {`${milestone.milestoneNumber + 1}: ${milestone.label}`}
          <PencilSquareIcon
            onClick={() => setEditName(true)}
            className=' w-4'
          />
        </div>
      ) : (
        <TextInput
          defaultValue={milestone.label}
          onBlur={event => {
            updateMilestone({ label: event.currentTarget.value })
            setEditName(false)
          }}
        />
      )}
      <MilestoneBasisSettings
        milestone={milestone}
        updateMilestone={updateMilestone}
      />
      <hr />
      <div className='flex flex-col gap-2'>
        {milestone.basis === 'costs' && (
          <Switch
            label='Distribute remaining costs evenly'
            checked={milestone.basis === 'costs' && milestone.evenDistribution}
            onChange={event =>
              updateMilestone({
                evenDistribution: event.currentTarget.checked
              })
            }
          />
        )}
        {!usingEvenDistribution && (
          <ValueSlider
            value={milestone.costComponent}
            onChange={value => {
              updateMilestone({ costComponent: value })
            }}
            min={0} // the total number of items minus
            max={1}
            step={0.01}
            label={value => `${(value * 100).toFixed(0)}%`}
            title='Cost Component'
          />
        )}
      </div>
      <ValueSlider
        value={milestone.artistShare}
        onChange={value => {
          updateMilestone({
            artistShare: value,
            moncoeurShare: 1 - value
          })
        }}
        min={0} // the total number of items minus
        max={1}
        step={0.01}
        label={value => `${(value * 100).toFixed(0)}%`}
        title='Artist Share'
      />
      <ValueSlider
        value={milestone.moncoeurShare}
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
  updateMilestone: (value: Partial<Milestone>) => void
}) {
  const settings = chartSettings()
  const [basisType, setBasisType] = useState(
    typeof milestone.basisPercentage === 'number' ? 'percentage' : 'fixed value'
  )

  const hideBasisEntry = Boolean(
    milestone.basis === 'costs' && milestone.evenDistribution
  )

  const [valueMin, valueMax] = getMinMax(milestone, settings)

  return (
    <>
      <Select
        label='Milestone Basis'
        data={[...basisOptions]}
        value={milestone.basis}
        onChange={value => {
          if (value) {
            updateMilestone({ basis: value as BasisOptions })
          }
        }}
      />
      {!hideBasisEntry ? (
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
                updateMilestone({ basisPercentage: value })
              }}
            />
          ) : (
            <ValueSlider
              value={milestone.basisTotal}
              min={valueMin}
              max={valueMax}
              title='Set Value'
              onChange={value => {
                updateMilestone({ basisTotal: value })
              }}
            />
          )}
        </>
      ) : null}
    </>
  )
}
function getMinMax(
  milestone: Milestone,
  settings: ChartSettings
): [number, number] {
  switch (milestone.basis) {
    case 'costs':
      return [0, settings.editionCosts]
    case 'revenue':
      return [0, settings.salePrice * settings.editionSize]
    case 'sales':
      return [0, settings.editionSize]
    default:
      return [0, 0]
  }
}
