import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      checkDirectory: (args: { path: string }) => Promise<{ exists: boolean; hasGit: boolean }>
      selectDirectory: () => Promise<{ canceled: boolean; path?: string; hasGit?: boolean }>
      initRepository: (args: {
        path: string
        bare?: boolean
        createReadme?: boolean
        initialCommitMessage?: string
      }) => Promise<{ success: boolean; error?: string; hasGit?: boolean }>
      gitStatus: (args: { path: string }) => Promise<{ hasGit: boolean; error?: string }>
    }
  }

  type GeneralError = {
    message?: string
  }
}
