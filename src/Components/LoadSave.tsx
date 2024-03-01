'use client'
import React, { useCallback } from 'react'
import { PropsWithChildren, useState } from 'react'

import { Modal, Popover, Select, TextInput, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import { updateSettings } from '../app/_data/persistence'
import {
  DocumentDuplicateIcon,
  FolderArrowDownIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

import { chartSettings } from '@/app/_data/chart-settings'
import { loadSaveSettings } from '@/app/_data/load-save-settings'
import { DEFAULT_SETTINGS } from '@/app/_data/constants'

export function LoadSave() {
  return (
    <div className='flex flex-col gap-2 rounded-lg p-4 ring-1'>
      <h2 className='text-lg font-semibold'>Scenario Controls</h2>
      <div className='flex items-end'>
        <SelectSavedScenario />
        <EditNameDescription />
      </div>

      <div className='flex gap-2'>
        <CreateNewScenario />
        <Save />
        <DuplicateScenario />
        <Delete />
      </div>
    </div>
  )
}

interface ChartModalProps {
  icon: React.ReactNode
  // footer: a render prop function that gives the close function as a parameter returns a React.ReactNode
  footer: (close: () => void) => React.ReactNode
  buttonText: string
  modalTitle: string
  disabled?: boolean
}

function ChartModal({
  icon,
  buttonText,
  modalTitle,
  footer,
  children,
  disabled
}: PropsWithChildren<ChartModalProps>) {
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <>
      <button
        disabled={disabled}
        onClick={open}
        className='flex grow items-center gap-1 rounded-md p-1 text-xs font-light ring-1 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600'
      >
        {icon}
        {buttonText}
      </button>
      <Modal withCloseButton={false} opened={opened} onClose={close} centered>
        <div className='gap-2'>
          <h2 className='text-lg font-semibold'>{modalTitle}</h2>
          {children}
          {footer(close)}
        </div>
      </Modal>
    </>
  )
}

function SelectSavedScenario() {
  const { loadSettings, id } = chartSettings()
  const { list } = loadSaveSettings()
  return (
    <Select
      className='grow'
      label='Current Scenario'
      data={list}
      value={id}
      onChange={(_, option) => {
        if (option?.value && id !== option.value) {
          loadSettings(option.value)
        }
      }}
    />
  )
}

function CreateNewScenario() {
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

function EditNameDescription() {
  const { saveSettings, name, description } = chartSettings()

  const nameRef = React.createRef<HTMLInputElement>()
  const descRef = React.createRef<HTMLTextAreaElement>()

  const handleEdit = useCallback(() => {
    saveSettings({
      name: nameRef.current?.value || name,
      description: descRef.current?.value
    })
  }, [nameRef, descRef, saveSettings, name])

  return (
    <Popover
      width={300}
      trapFocus
      position='bottom'
      withArrow
      shadow='md'
      onClose={handleEdit}
    >
      <Popover.Target>
        <PencilIcon className='m-2 w-5' />
      </Popover.Target>
      <Popover.Dropdown>
        <TextInput
          ref={nameRef}
          defaultValue={name}
          label='Name'
          placeholder='Enter a name for this scenario'
        />
        <Textarea
          ref={descRef}
          label='Description'
          resize='vertical'
          placeholder='Enter a description for this scenario'
          defaultValue={description}
        />
      </Popover.Dropdown>
    </Popover>
  )
}

function Save() {
  const settings = chartSettings()

  const handleSave = useCallback(() => {
    updateSettings(settings)
    notifications.show({
      color: 'green',
      title: 'Saved!',
      message: 'Your settings have been saved.'
    })
    console.log('saved', settings)
  }, [settings])

  return (
    <button
      onClick={handleSave}
      className='flex grow items-center gap-1 rounded-md p-1 text-xs font-light ring-1'
    >
      <FolderArrowDownIcon className='w-5' />
      Save
    </button>
  )
}

function DuplicateScenario() {
  const settings = chartSettings()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const handleDuplicate = () => {
    settings.duplicateCurrentSettings(name, description)
  }
  return (
    <ChartModal
      icon={<DocumentDuplicateIcon className='w-5' />}
      buttonText='Copy'
      modalTitle='Copy / Duplicate Scenario'
      footer={close => (
        <div className='mt-3 flex gap-3'>
          <button
            disabled={!name || !description}
            onClick={() => {
              handleDuplicate()
              close()
            }}
            className='rounded-sm bg-green-300 px-2 py-1 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600'
          >
            Duplicate
          </button>
          <button onClick={close} className='rounded-sm bg-red-300 px-2 py-1'>
            Cancel
          </button>
        </div>
      )}
    >
      <div className='flex flex-col gap-3'>
        <p className='mt-2 text-sm'>
          Enter the name and a description for the duplicated scenario
        </p>

        <TextInput
          label='Name'
          placeholder='Enter a name'
          value={name}
          onChange={e => setName(e.currentTarget.value)}
        />
        <Textarea
          label='Description'
          resize='vertical'
          placeholder='Enter a description'
          value={description}
          onChange={e => setDescription(e.currentTarget.value)}
        />
      </div>
    </ChartModal>
  )
}

function Delete() {
  const { id, deleteSettings } = chartSettings()

  const handleDelete = () => {
    // do not delete the default settings as we always need one
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
