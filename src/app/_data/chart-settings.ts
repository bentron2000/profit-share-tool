'use client'
import type { RequireExactlyOne } from 'type-fest'
import { create } from 'zustand'
import {
  DEFAULT_DISPLAY_DATA,
  DEFAULT_ITEM_KEY,
  DEFAULT_NUM_ITEMS,
  DEFAULT_SALE_PRICE,
  DEFAULT_SETTINGS
} from './constants'
import { SettingsListItem } from './persistence'

export interface ChartSettings {
  numItemsToSell: number
  setnumItemsToSell: (size: number) => void
  salePrice: number
  setSalePrice: (price: number) => void
  editionCosts: number
  setEditionCosts: (amount: number) => void
  allCostsRecoupedBy: number
  setallCostsRecoupedBy: (milestone: number) => void
  milestones: Record<number, Milestone>
  saveMilestone: (milestone: Milestone) => void
  dataToDisplay: string[]
  setDataToDisplay: (data: string[]) => void
  loadSettings: (settings: Partial<ChartSettings>) => void
  currentSetting?: SettingsListItem
}
type BasisValue = {
  basisPercentage: number
  basisTotal: number
}
type SalesBasis = {
  basis: 'sales'
} & RequireExactlyOne<BasisValue>
type RevenueBasis = {
  basis: 'revenue'
} & RequireExactlyOne<BasisValue>
type CostBasis = {
  basis: 'costs'
} & RequireExactlyOne<BasisValue> & { evenDistribution?: boolean }
interface MilestoneData {
  milestoneNumber: number
  label: string
  costComponent: number // as a percentage of the sale price - ignored if this is a cost basis with an even distribution
  partnerShare: number
  companyShare: number
  sharedDiscount: number
  partnerDiscount: number
  companyDiscount: number
}

export const basisOptions = ['sales', 'revenue', 'costs'] as const
export type BasisOptions = (typeof basisOptions)[number]

export type Milestone = MilestoneData & (SalesBasis | RevenueBasis | CostBasis)

export const chartSettings = create<ChartSettings>()((set, get) => ({
  numItemsToSell: DEFAULT_NUM_ITEMS,
  setnumItemsToSell: size => set({ numItemsToSell: size }),
  salePrice: DEFAULT_SALE_PRICE,
  setSalePrice: price => set({ salePrice: price }),
  editionCosts: DEFAULT_NUM_ITEMS * DEFAULT_SALE_PRICE * 0.2,
  setEditionCosts: amount => set({ editionCosts: amount }),
  allCostsRecoupedBy: DEFAULT_NUM_ITEMS,
  setallCostsRecoupedBy: milestone => set({ allCostsRecoupedBy: milestone }),
  milestones: DEFAULT_SETTINGS.settings.milestones,
  saveMilestone: milestone => {
    const oldMilstones = get().milestones
    return {
      milestones: { ...oldMilstones, [milestone.milestoneNumber]: milestone }
    }
  },
  dataToDisplay: DEFAULT_DISPLAY_DATA,
  setDataToDisplay: data => set({ dataToDisplay: data }),
  loadSettings: settings => set(settings),
  currentSetting: DEFAULT_SETTINGS.listEntry
}))
