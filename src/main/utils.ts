import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
import { join, resolve } from 'path'
import { createRequire } from 'module'

export async function getGitStatus(path: string): Promise<{ hasGit: boolean; error?: string }> {
  try {
    const addonPath = join(app.getAppPath(), is.dev ? 'addons/Release' : 'resources/addons')
    console.log('addonPath:', addonPath)
    const require = createRequire(addonPath)
    const gitAddon = require(resolve(addonPath, 'git-helper.node'))
    const res = gitAddon.default.Hello(path)
    console.log('Native addon result:', res)
    return res
  } catch (err) {
    console.error('Error checking git status:', err)
    return { hasGit: false, error: (err as GeneralError)?.message ?? String(err) }
  }
}
