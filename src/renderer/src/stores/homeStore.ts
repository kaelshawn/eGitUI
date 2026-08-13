import { create } from 'zustand'

interface HomeState {
  createRepDlg: boolean
  toggleCreateRepDlg: () => void
  openRep: () => void
}

export const useHomeStore = create<HomeState>((set) => ({
  createRepDlg: false,
  toggleCreateRepDlg: () => set((state) => ({ createRepDlg: !state.createRepDlg })),
  openRep: () => {
    window.electron.ipcRenderer.send('open-repository', { path: 'path/to/repo' })
  }
}))
