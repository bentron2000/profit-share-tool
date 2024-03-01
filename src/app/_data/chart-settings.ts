'use client'
import type { RequireExactlyOne } from 'type-fest'
import { create } from 'zustand'
import {
  DEFAULT_NUM_ITEMS,
  DEFAULT_SALE_PRICE,
  DEFAULT_SETTINGS
} from './constants'

export interface ChartSettings {
  numItemsToSell: number
  setnumItemsToSell: (size: number) => void
  salePrice: number
  setSalePrice: (price: number) => void
  editionCosts: number
  setEditionCosts: (amount: number) => void
  allCostsRecoupedBy: number
  setallCostsRecoupedBy: (milestone: number) => void
  milestones: Map<number, Milestone>
  saveMilestone: (milestone: Milestone) => void
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
    oldMilstones.set(milestone.milestoneNumber, milestone)
    set({ milestones: new Map(oldMilstones) })
  }
}))