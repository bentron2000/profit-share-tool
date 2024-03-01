'use client'
import React, { useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { updateSettings } from '../../lib/persistence'
import { FolderArrowDownIcon } from '@heroicons/react/24/outline'
import { chartSettings } from '@/lib/chart-settings'

export function SaveScenario() {
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
