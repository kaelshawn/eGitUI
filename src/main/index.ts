import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { basename, join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import Logger from 'electron-log'
import fs from 'fs'
import { execFile } from 'child_process'
import { createGitRepository } from './utils'
import { windowManager } from './utils/create-window'

const logger = Logger.scope('main')

function isGitRepository(path: string): boolean {
  try {
    const gitDir = join(path, '.git')
    if (fs.existsSync(gitDir) && fs.statSync(gitDir).isDirectory()) {
      return true
    }

    const headPath = join(path, 'HEAD')
    const objectsPath = join(path, 'objects')
    return fs.existsSync(headPath) && fs.existsSync(objectsPath)
  } catch (err) {
    logger.error('Error checking if directory is a git repository:', err)
    return false
  }
}

function execGitCommand(args: string[], options: { cwd?: string } = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile('git', args, options, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      resolve(`${stdout || ''}${stderr || ''}`)
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron-gitextensions')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => {
    logger.info('pong 2')
  })

  ipcMain.handle('select-directory', async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })

      if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
        return { canceled: true }
      }

      const selected = result.filePaths[0]
      return {
        canceled: false,
        path: selected,
        hasGit: isGitRepository(selected)
      }
    } catch (err) {
      logger.error('select-directory error', err)
      return { canceled: true, error: (err as GeneralError)?.message ?? String(err) }
    }
  })

  ipcMain.handle('check-directory', async (_event, args: { path: string }) => {
    try {
      if (!args?.path) {
        return { exists: false }
      }
      const exists = fs.existsSync(args.path) && fs.statSync(args.path).isDirectory()
      if (!exists) {
        return { exists: false }
      }
      return { exists: true, path: args.path, hasGit: isGitRepository(args.path) }
    } catch (err) {
      logger.error('check-directory error', err)
      return { exists: false, error: (err as GeneralError)?.message ?? String(err) }
    }
  })

  ipcMain.handle(
    'init-repo',
    async (
      _event,
      args: {
        path: string
        bare?: boolean
        createReadme?: boolean
        initialCommitMessage?: string
      }
    ) => {
      try {
        if (!args?.path) {
          return { success: false, error: 'Path is required.' }
        }

        const repoPath = args.path
        const stat = fs.existsSync(repoPath) ? fs.statSync(repoPath) : null
        if (!stat || !stat.isDirectory()) {
          return { success: false, error: 'Path does not exist or is not a directory.' }
        }

        const bare = Boolean(args.bare)
        const createReadme = Boolean(args.createReadme) && !bare
        const initialCommitMessage = args.initialCommitMessage || 'Initial commit'

        logger.info(`Git repository initialized at ${repoPath}. Bare: ${bare}`)

        let stdout = ''

        if (bare) {
          stdout += await createGitRepository(repoPath)
        } else {
          stdout += await createGitRepository(repoPath)
        }
        logger.info('Git repository creation stdout:', stdout)

        if (createReadme) {
          try {
            const readmePath = join(repoPath, 'README.md')
            fs.writeFileSync(readmePath, `# ${basename(repoPath)}\n`, 'utf-8')
            stdout += await execGitCommand(['add', 'README.md'], { cwd: repoPath })
            stdout += await execGitCommand(['commit', '-m', initialCommitMessage], {
              cwd: repoPath
            })
          } catch (err) {
            logger.error('create-readme error', err)
            return { success: false, error: (err as GeneralError)?.message ?? String(err), stdout }
          }
        }

        return { success: true, hasGit: isGitRepository(repoPath), stdout }
      } catch (err) {
        logger.error('init-repo error', err)
        return { success: false, error: (err as GeneralError)?.message ?? String(err) }
      }
    }
  )

  ipcMain.handle('git-status', async (_event, args: { path: string }) => {
    logger.info('git-status called with path:', args.path)
  })

  windowManager.createWindow()
  windowManager.loadPage('home')

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) windowManager.createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
