import { create } from 'zustand'

interface RepState {
  histories: string[]
  selectedPath: string
}

export const useCreateRepStore = create<RepState>((set) => ({
  histories: [],
  selectedPath: ''
}))
