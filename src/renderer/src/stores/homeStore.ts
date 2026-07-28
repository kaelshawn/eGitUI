import { create } from 'zustand'

interface HomeState {
  createRepDlg: boolean
  toggleCreateRepDlg: () => void
}

export const useHomeStore = create<HomeState>((set) => ({
  createRepDlg: false,
  toggleCreateRepDlg: () => set((state) => ({ createRepDlg: !state.createRepDlg }))
}))
