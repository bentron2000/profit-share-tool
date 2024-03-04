'use client'
import type { RequireExactlyOne } from 'type-fest'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  DEFAULT_DISPLAY_DATA,
  DEFAULT_NUM_ITEMS,
  DEFAULT_SALE_PRICE,
  DEFAULT_SETTINGS
} from './constants'
import {
  createNewSettings,
  deleteSettings,
  readSettings,
  updateSettings
} from './persistence'
import { dumbRandomIdGenerator } from '@/lib/utils'
import { loadSaveSettings } from './load-save-settings'

export interface ChartSettings {
  numItemsToSell: number
  setnumItemsToSell: (size: number) => void
  salePrice: number
  setSalePrice: (price: number) => void
  totalProjectCosts: number
  setProjectCosts: (amount: number) => void
  allCostsRecoupedBy: number
  setallCostsRecoupedBy: (milestone: number) => void
  milestones: Record<number, Milestone>
  saveMilestone: (milestone: Milestone) => void
  deleteMilestone: (milestone: Milestone) => void
  dataToDisplay: string[]
  setDataToDisplay: (data: string[]) => void
  createNewSettings: (name: string, description: string) => void
  duplicateCurrentSettings: (name: string, description: string) => void
  loadSettings: (id: string) => void
  saveSettings: (settings: Partial<ChartSettings>) => void
  deleteSettings: (id: string) => void
  name: string
  id: string
  description: string
}
type BasisValue = RequireExactlyOne<
  {
    basisPercentage: number
    basisTotal: number
  },
  'basisPercentage' | 'basisTotal'
>
type SalesBasis = {
  basis: 'sales'
} & BasisValue

type RevenueBasis = {
  basis: 'revenue'
} & BasisValue

type CostBasis = {
  basis: 'costs'
} & BasisValue
interface MilestoneData {
  milestoneNumber: number
  label: string
  costComponent: number // as a percentage of the sale price - ignored if this is a cost basis with an even distribution
  partnerShare: number
  companyShare: number
  sharedDiscount: number
  partnerDiscount: number
  companyDiscount: number
  evenDistribution?: boolean
}

export const basisOptions = ['sales', 'revenue', 'costs'] as const
export type BasisOptions = (typeof basisOptions)[number]

export type Milestone = MilestoneData & (SalesBasis | RevenueBasis | CostBasis)

export const chartSettings = create<ChartSettings>()(
  devtools((set, get) => ({
    id: DEFAULT_SETTINGS.id,
    name: DEFAULT_SETTINGS.name,
    description: DEFAULT_SETTINGS.description,
    numItemsToSell: DEFAULT_NUM_ITEMS,
    setnumItemsToSell: size => set({ numItemsToSell: size }),
    salePrice: DEFAULT_SALE_PRICE,
    setSalePrice: price => set({ salePrice: price }),
    totalProjectCosts: DEFAULT_NUM_ITEMS * DEFAULT_SALE_PRICE * 0.2,
    setProjectCosts: amount => set({ totalProjectCosts: amount }),
    allCostsRecoupedBy: DEFAULT_NUM_ITEMS,
    setallCostsRecoupedBy: milestone => set({ allCostsRecoupedBy: milestone }),
    milestones: DEFAULT_SETTINGS.milestones,
    deleteMilestone: milestone => {
      // get all the milestones, remove this one, then modify the indexes of the remainder so that there are no gaps
      const settings = get()
      const newMilestones = { ...settings.milestones }
      delete newMilestones[milestone.milestoneNumber]
      const updatedMilestones = Object.values(newMilestones).reduce(
        (acc, milestone, index) => {
          return {
            ...acc,
            [index]: milestone
          }
        },
        {}
      )
      set({ milestones: updatedMilestones })
      get().saveSettings({ ...settings, milestones: updatedMilestones })
    },
    saveMilestone: milestone => {
      const oldMilstones = get().milestones
      const updatedMilestones = {
        milestones: { ...oldMilstones, [milestone.milestoneNumber]: milestone }
      }
      set(updatedMilestones)
      get().saveSettings(updatedMilestones)
    },
    dataToDisplay: DEFAULT_DISPLAY_DATA,
    setDataToDisplay: data => set({ dataToDisplay: data }),
    createNewSettings: (name, description) => {
      const newSettings = {
        ...DEFAULT_SETTINGS,
        id: dumbRandomIdGenerator(),
        name,
        description
      }

      createNewSettings(newSettings)
      set(newSettings)
      loadSaveSettings.getState().reloadList()
    },
    duplicateCurrentSettings: (name, description) => {
      const currentSettings = get()
      const newSettings = {
        ...currentSettings,
        id: dumbRandomIdGenerator(),
        name,
        description
      }

      createNewSettings(newSettings)
      set(newSettings)
      loadSaveSettings.getState().reloadList()
    },
    loadSettings: id => {
      const settings = readSettings(id)
      if (settings) {
        set(settings)
      }
    },
    saveSettings: settings => {
      const oldSettings = get()
      const newSettings = { ...oldSettings, ...settings }
      updateSettings(newSettings)
      set(newSettings)
      loadSaveSettings.getState().reloadList()
    },
    deleteSettings: id => {
      deleteSettings(id)
      loadSaveSettings.getState().reloadList()
      const toLoad = loadSaveSettings.getState().list[0]
      if (toLoad) {
        get().loadSettings(toLoad.value)
      }
    }
  }))
)
