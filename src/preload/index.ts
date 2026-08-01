import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  checkDirectory: (opts: { path: string }) => ipcRenderer.invoke('check-directory', opts),
  initRepository: (opts: {
    path: string
    bare?: boolean
    createReadme?: boolean
    initialCommitMessage?: string
  }) => ipcRenderer.invoke('init-repo', opts)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
