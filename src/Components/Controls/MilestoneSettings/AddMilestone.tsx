import { PlusIcon } from '@heroicons/react/24/outline'
import { ChartModal } from '../../Shared/ChartModalProps'
import { TextInput } from '@mantine/core'
import { chartSettings } from '@/lib/chart-settings'
import { useState } from 'react'
import { DEFAULT_MILESTONE } from '@/lib/constants'

export function AddMilestone() {
  const { milestones, saveMilestone } = chartSettings()
  const [newName, setNewName] = useState('')

  const handleAddMilestone = () => {
    const newMilestoneNumber = Object.keys(milestones).length
    saveMilestone({
      ...DEFAULT_MILESTONE[0],
      milestoneNumber: newMilestoneNumber,
      label: newName
    })
  }

  return (
    <ChartModal
      footer={close => (
        <button
          disabled={!newName}
          onClick={() => {
            handleAddMilestone()
            close()
          }}
          className='mt-2 rounded-md bg-green-300 px-4 py-1 disabled:bg-slate-200 disabled:text-slate-400'
        >
          Ok
        </button>
      )}
      buttonClassNames=''
      icon={<PlusIcon className='w-5' />}
      modalTitle='Add Milestone'
    >
      <div className='mt-2'>Enter a name for the new milestone</div>
      <TextInput
        className='mt-2'
        placeholder='My next milestone'
        value={newName}
        onChange={e => setNewName(e.currentTarget.value)}
      />
    </ChartModal>
  )
}
