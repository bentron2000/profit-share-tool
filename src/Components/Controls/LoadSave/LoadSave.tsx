'use client'
import React, { useEffect } from 'react'

import { DeleteScenario } from './DeleteScenario'
import { DuplicateScenario } from './DuplicateScenario'
import { SaveScenario } from './SaveScenario'
import { EditNameDescription } from './EditNameDescription'
import { CreateNewScenario } from './CreateNewScenario'
import { SelectSavedScenario } from './SelectSavedScenario'
import { chartSettings } from '@/lib/chart-settings'
import { DEFAULT_ITEM_KEY } from '@/lib/constants'

export function LoadSave() {
  const { loadSettings } = chartSettings()

  useEffect(() => {
    loadSettings(DEFAULT_ITEM_KEY)
  }, [loadSettings])

  return (
    <div className='flex flex-col gap-2 rounded-lg p-4 ring-1'>
      <h2 className='text-lg font-semibold'>Scenario Controls</h2>
      <div className='flex items-end'>
        <SelectSavedScenario />
        <EditNameDescription />
      </div>
      <div className='flex gap-2'>
        <CreateNewScenario />
        <SaveScenario />
        <DuplicateScenario />
        <DeleteScenario />
      </div>
    </div>
  )
}
