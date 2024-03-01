import { PlusIcon } from '@heroicons/react/24/outline'
import { ChartModal } from '../../Shared/ChartModalProps'
import { TextInput } from '@mantine/core'

export function AddMilestone() {
  const handleAddMilestone = () => {}
  return (
    <ChartModal
      footer={close => (
        <button
          onClick={() => {
            handleAddMilestone()
            close()
          }}
          className='mt-2 rounded-md bg-green-300 px-4 py-1'
        >
          Ok
        </button>
      )}
      buttonClassNames=''
      icon={<PlusIcon className='w-5' />}
      modalTitle='Add Milestone'
    >
      <div className='mt-2'>Enter a name for the new milestone</div>
      <TextInput className='mt-2' placeholder='My next milestone' />
    </ChartModal>
  )
}
