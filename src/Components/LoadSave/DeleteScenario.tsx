'use client'
import React from 'react'
import { notifications } from '@mantine/notifications'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { chartSettings } from '@/app/_data/chart-settings'
import { DEFAULT_SETTINGS } from '@/app/_data/constants'
import { ChartModal } from '../Shared/ChartModalProps'

export function DeleteScenario() {
  const { id, deleteSettings } = chartSettings()

  const handleDelete = () => {
    // do not allow deletion of the initial settings in case this is accidentally attempted
    if (id === DEFAULT_SETTINGS.id) {
      notifications.show({
        color: 'red',
        title: 'Error!',
        message: 'You cannot delete the default settings.'
      })
      return
    }
    deleteSettings(id)
    notifications.show({
      color: 'green',
      title: 'Deleted!',
      message: 'Your settings have been deleted.'
    })
  }

  return (
    <ChartModal
      disabled={id === DEFAULT_SETTINGS.id}
      icon={<DocumentDuplicateIcon className='w-5' />}
      buttonText='Delete'
      modalTitle='Delete Scenario'
      footer={close => (
        <div className='mt-3 flex gap-3'>
          <button
            onClick={() => {
              handleDelete()
              close()
            }}
            className='rounded-sm bg-red-300 px-2 py-1 font-bold'
          >
            Delete
          </button>
          <button onClick={close} className='rounded-sm bg-green-300 px-2 py-1'>
            Cancel
          </button>
        </div>
      )}
    >
      <div className='flex flex-col gap-3'>
        <p className='mt-2 text-sm'>Are you sure? This cannot be undone.</p>
      </div>
    </ChartModal>
  )
}
