import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path/win32'
import icon from '../../../resources/icon.png?asset'

class WindowManager {
  _window: Electron.BrowserWindow | null = null
  static _instance: WindowManager | null = null
  constructor() {
    if (app.isReady()) {
      this.createWindow()
    }
  }
  createWindow(): void {
    this._window = new BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })
    this._window.on('ready-to-show', () => {
      this._window!.show()
    })

    this._window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    ipcMain.on('open-repository', (_event, args: { path: string }) => {
      if (args?.path) {
        this.loadPage('repository')
      } else {
        this.loadPage('empty')
      }
    })
  }

  async loadPage(type: 'home' | 'empty' | 'repository' = 'home'): Promise<void> {
    if (this._window) {
      const url = new URL(
        `${type}.html`,
        process.env['ELECTRON_RENDERER_URL'] || `file://${join(__dirname, '../renderer/')}`
      )
      await this._window.loadURL(url.href)
    }
  }

  static getInstance(): WindowManager {
    if (!WindowManager._instance) {
      WindowManager._instance = new WindowManager()
    }
    return WindowManager._instance
  }
}

export const windowManager = WindowManager.getInstance()
