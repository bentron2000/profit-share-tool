'use client'
import React, { useCallback } from 'react'
import { PropsWithChildren, useState } from 'react'
import { Modal, Select, TextInput, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import {
  SettingsListItem,
  createSettings,
  getList,
  saveSettings
} from '../app/_data/persistence'
import {
  DocumentDuplicateIcon,
  FolderArrowDownIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

import { chartSettings } from '@/app/_data/chart-settings'
import { dumbRandomIdGenerator } from '@/lib/utils'
import { DEFAULT_SETTINGS } from '@/app/_data/constants'

export const list = getList()

export function LoadSave() {
  // const [currentSettings, setCurrentSettings] = useState<
  //   SettingsListItem | null | undefined
  // >(list[0])
  const settings = chartSettings()

  return (
    <div className='flex flex-col gap-2 rounded-lg p-4 ring-1'>
      <h2 className='text-lg font-semibold'>Scenario Controls</h2>
      <Select
        label='Current Scenario'
        data={list}
        value={settings.currentSetting?.value}
        onChange={(_, option) => {
          console.log({ item: option })
        }}
      />
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
  const nameRef = React.useRef<HTMLInputElement>(null)
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null)

  const handleCreate = () => {
    const listItem = {
      value: dumbRandomIdGenerator(),
      label: nameRef?.current?.value || 'New Scenario',
      description: descriptionRef?.current?.value || 'No description'
    } satisfies SettingsListItem
    createSettings(listItem, DEFAULT_SETTINGS.settings)
    // then we should load these new settings from localstore.

    settings.loadSettings({
      ...DEFAULT_SETTINGS.settings,
      currentSetting: listItem
    })
  }
  return (
    <ChartModal
      icon={<PlusIcon className='w-5' />}
      buttonText='New'
      modalTitle='New Scenario'
      footer={close => (
        <div className='mt-3 flex gap-3'>
          <button
            onClick={() => {
              handleCreate()
              close()
            }}
            className='rounded-sm bg-green-300 px-2 py-1'
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
          ref={nameRef}
          label='Name'
          placeholder='Enter a name for this scenario'
        />
        <Textarea
          ref={descriptionRef}
          label='Description'
          resize='vertical'
          placeholder='Enter a description for this scenario'
        />
      </div>
    </ChartModal>
  )
}

function Save() {
  const settings = chartSettings()

  const handleSave = useCallback(() => {
    if (!settings.currentSetting?.value) return
    saveSettings(settings.currentSetting.value, settings)
    notifications.show({
      color: 'green',
      title: 'Saved!',
      message: 'Your settings have been saved.'
    })
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
