import { create } from 'zustand'

interface RepState {
  histories: string[]
  selectedPath: string
  hasGit: boolean | null
  repoType: 'personal' | 'central'
  createReadme: boolean
  initialCommitMessage: string
  status: string
  creating: boolean
  recentDirs: string[]
  onBrowse: () => Promise<void>
  onCreate: () => Promise<void>
  checkDirectory: (path: string) => Promise<void>
}

export const useCreateRepStore = create<RepState>((set, get) => ({
  histories: [],
  selectedPath: '',
  hasGit: null,
  repoType: 'central',
  createReadme: true,
  initialCommitMessage: 'Initial commit',
  status: 'idle',
  creating: false,
  recentDirs: localStorage.getItem('recentDirs')
    ? JSON.parse(localStorage.getItem('recentDirs')!)
    : [],
  checkDirectory: async (path: string) => {
    if (!path) {
      set({ status: 'Please select a directory first', hasGit: null })
      return
    }

    set({ status: 'Checking selected directory...' })
    try {
      const res = await window.api.checkDirectory({ path })
      if (!res || !res.exists) {
        set({
          hasGit: false,
          status: 'The selected path does not exist or is not a folder.'
        })
        return
      }
      set({
        hasGit: !!res.hasGit,
        status: res.hasGit
          ? 'This folder already contains a git repository'
          : 'No git repository found in the selected folder'
      })
    } catch (error) {
      set({
        hasGit: null,
        status: 'Error checking directory: ' + ((error as GeneralError)?.message ?? String(error))
      })
    }
  },
  onBrowse: async () => {
    set({ status: 'Opening directory chooser...' })
    try {
      const res = await window.api.selectDirectory()
      if (!res || res.canceled) {
        set({ status: 'No directory selected' })
        return
      }
      if (res.path) {
        const tmp = new Set([res.path, ...get().recentDirs])
        set({
          selectedPath: res.path,
          recentDirs: Array.from(tmp),
          hasGit: !!res.hasGit,
          status: res.hasGit
            ? 'This folder already contains a git repository'
            : 'No git repository found in the selected folder'
        })
        localStorage.setItem('recentDirs', JSON.stringify(get().recentDirs))
      }
    } catch (error) {
      set({
        status:
          'Error opening directory chooser: ' + ((error as GeneralError)?.message ?? String(error))
      })
    }
  },
  onCreate: async () => {
    set({ creating: true, status: 'Creating repository...' })
    try {
      const res = await window.api.initRepository({
        path: get().selectedPath,
        bare: get().repoType === 'central',
        createReadme: get().createReadme,
        initialCommitMessage: get().initialCommitMessage
      })
      if (res.success) {
        set({ status: 'Repository created successfully!' })
      } else {
        set({ status: 'Error creating repository: ' + (res.error ?? 'Unknown error') })
      }
    } catch (error) {
      set({
        status: 'Error creating repository: ' + ((error as GeneralError)?.message ?? String(error))
      })
    } finally {
      set({ creating: false })
    }
  }
}))
