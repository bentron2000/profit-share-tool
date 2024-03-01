'use client'
import React from 'react'
import { Select } from '@mantine/core'
import { chartSettings } from '@/lib/chart-settings'
import { loadSaveSettings } from '@/lib/load-save-settings'

export function SelectSavedScenario() {
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
