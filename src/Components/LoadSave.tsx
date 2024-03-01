'use client'
import React, { useCallback, useEffect } from 'react'
import { PropsWithChildren, useState } from 'react'

import { Modal, Popover, Select, TextInput, Textarea } from '@mantine/core'
import { useDebounceCallback, useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import { getList, updateSettings } from '../app/_data/persistence'
import {
  DocumentDuplicateIcon,
  FolderArrowDownIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

import { chartSettings } from '@/app/_data/chart-settings'
import { loadSaveSettings } from '@/app/_data/load-save-settings'

export function LoadSave() {
  const { loadSettings, id } = chartSettings()
  const { list } = loadSaveSettings()

  return (
    <div className='flex flex-col gap-2 rounded-lg p-4 ring-1'>
      <h2 className='text-lg font-semibold'>Scenario Controls</h2>
      <div className='flex items-end'>
        <Select
          className='grow'
          label='Current Scenario'
          data={list}
          value={id}
          onChange={(_, option) => {
            console.log({ item: option })
            loadSettings(option.value)
          }}
        />
        <Edit />
      </div>

      <div className='flex gap-2'>
        <New />
        <Save />
        <span className='flex grow items-center gap-1 rounded-md p-1 text-xs font-light ring-1'>
          <DocumentDuplicateIcon className='w-5' />
          Copy
        </span>
        <span className='flex grow items-center gap-1 rounded-md p-1 text-xs font-light ring-1'>
          <TrashIcon className='w-5' />
          Delete
        </span>
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
}

function ChartModal({
  icon,
  buttonText,
  modalTitle,
  footer,
  children
}: PropsWithChildren<ChartModalProps>) {
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <>
      <button
        onClick={open}
        className='flex grow items-center gap-1 rounded-md p-1 text-xs font-light ring-1'
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

function New() {
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
function Edit() {
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
