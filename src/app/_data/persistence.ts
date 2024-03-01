import { ChartSettings } from './chart-settings'
import { DEFAULT_SETTINGS } from './constants'

export interface SettingsListItem {
  value: string // a unique identifier for the settings
  label: string // the name of the settings
  description: string // a description of the settings
}

const serializeSettings = (settings: Partial<ChartSettings>) =>
  JSON.stringify(settings)

const deserializeSettings = (serialized: string) => JSON.parse(serialized)

export function getList() {
  if (typeof localStorage === 'undefined') return [DEFAULT_SETTINGS.listEntry]
  const data = localStorage.getItem('list')
  if (data) {
    return JSON.parse(data) as SettingsListItem[]
  } else {
    init()
  }
  return [DEFAULT_SETTINGS.listEntry]
}

function init() {
  localStorage.setItem('list', JSON.stringify([DEFAULT_SETTINGS.listEntry]))
  localStorage.setItem(
    DEFAULT_SETTINGS.listEntry.value,
    serializeSettings(DEFAULT_SETTINGS.settings)
  )
}

export function createSettings(
  item: SettingsListItem,
  settings: Partial<ChartSettings>
) {
  const currentList = getList()
  const newList = [...currentList, item]
  localStorage.setItem('list', JSON.stringify(newList))
  localStorage.setItem(item.value, serializeSettings(settings))
}

export function deleteSettings(id: string) {
  const currentList = getList()
  const newList = currentList.filter(item => item.value !== id)
  localStorage.setItem('list', JSON.stringify(newList))
  localStorage.removeItem(id)
}

export function loadSettings(id: string) {
  const data = localStorage.getItem(id)
  if (data) {
    return deserializeSettings(data)
  }
  return null
}

export function saveSettings(id: string, settings: Partial<ChartSettings>) {
  localStorage.setItem(id, serializeSettings(settings))
}
