'use client'
import React from 'react'
import { useState } from 'react'
import { TextInput, Textarea } from '@mantine/core'
import { PlusIcon } from '@heroicons/react/24/outline'
import { chartSettings } from '@/lib/chart-settings'
import { ChartModal } from '../../Shared/ChartModal'

export function CreateNewScenario() {
  const settings = chartSettings()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const handleCreate = () => {
    settings.createNewSettings(name, description)
  }
  return (
    <ChartModal
      icon={<PlusIcon className='w-5' />}
      buttonText='New'
      modalTitle='New Scenario'
      footer={close => (
        <div className='mt-3 flex gap-3'>
          <button
            disabled={!name || !description}
            onClick={() => {
              handleCreate()
              close()
            }}
            className='rounded-sm bg-green-300 px-2 py-1 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600'
          >
            Create
          </button>
          <button onClick={close} className='rounded-sm bg-red-300 px-2 py-1'>
            Cancel
          </button>
        </div>
      )}
    >
      <div className='flex flex-col gap-3'>
        <p className='mt-2 text-sm'>
          Enter the name and a description for this scenario
        </p>

        <TextInput
          label='Name'
          placeholder='Enter a name for this scenario'
          value={name}
          onChange={e => setName(e.currentTarget.value)}
        />
        <Textarea
          label='Description'
          resize='vertical'
          placeholder='Enter a description for this scenario'
          value={description}
          onChange={e => setDescription(e.currentTarget.value)}
        />
      </div>
    </ChartModal>
  )
}
