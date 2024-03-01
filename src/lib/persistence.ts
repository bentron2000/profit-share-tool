import { ChartSettings } from './chart-settings'
import { SettingsListItem } from './load-save-settings'
import { DEFAULT_SETTINGS } from './constants'
import { SetRequired } from 'type-fest'

export function getList(): SettingsListItem[] {
  if (typeof localStorage === 'undefined')
    return [{ value: DEFAULT_SETTINGS.id, label: DEFAULT_SETTINGS.name }]

  const data = localStorage.getItem('saved-settings')

  if (data) {
    const allSettings = JSON.parse(data) as Record<string, ChartSettings>
    return Object.values(allSettings).map(({ id, name }) => ({
      value: id,
      label: name
    }))
  } else {
    init()
    return [{ value: DEFAULT_SETTINGS.id, label: DEFAULT_SETTINGS.name }]
  }
}

function init() {
  localStorage.setItem(
    'saved-settings',
    JSON.stringify({ [DEFAULT_SETTINGS.id]: DEFAULT_SETTINGS })
  )
}

export function createNewSettings(
  settings: SetRequired<Partial<ChartSettings>, 'id'>
) {
  const data = localStorage.getItem('saved-settings')

  const allSettings: Record<string, ChartSettings> = data
    ? JSON.parse(data)
    : {}

  const newData = {
    ...allSettings,
    [settings.id]: settings
  }
  localStorage.setItem('saved-settings', JSON.stringify(newData))
}

export function deleteSettings(id: string) {
  const data = localStorage.getItem('saved-settings')

  if (data) {
    const allSettings = JSON.parse(data) as Record<string, ChartSettings>
    delete allSettings[id]
    localStorage.setItem('saved-settings', JSON.stringify(allSettings))
  }
}

export function readSettings(id: string) {
  const data = localStorage.getItem('saved-settings')

  if (data) {
    const allSettings = JSON.parse(data) as Record<string, ChartSettings>
    return allSettings[id]
  }
}

export function updateSettings(
  settings: SetRequired<Partial<ChartSettings>, 'id'>
): boolean {
  const data = localStorage.getItem('saved-settings')

  if (data) {
    const allSettings = JSON.parse(data) as Record<string, ChartSettings>
    const oldSettings = allSettings[settings.id]
    const updatedSettings = { ...oldSettings, ...settings }
    const newData = {
      ...allSettings,
      [settings.id]: updatedSettings
    }
    localStorage.setItem('saved-settings', JSON.stringify(newData))
    return true
  } else {
    return false
  }
}
