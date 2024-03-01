'use client'
import { create } from 'zustand'
import { getList } from './persistence'

const initialList = getList()

export interface SettingsListItem {
  value: string
  label: string
}
interface LoadSaveState {
  reloadList: () => void
  list: SettingsListItem[]
}

export const loadSaveSettings = create<LoadSaveState>()((set, get) => ({
  reloadList: () => set({ list: getList() }),
  list: initialList
}))
