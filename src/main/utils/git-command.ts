import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
import { createRequire } from 'module'
import { join, resolve } from 'path'

export async function createGitRepository(
  path: string,
  bare: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const addonPath = join(app.getAppPath(), is.dev ? 'addons/bin/Release' : 'resources/addons')
    const require = createRequire(addonPath)
    const gitAddon = require(resolve(addonPath, 'git-helper.node'))
    const res = gitAddon.git_create_repo_api(path, bare)
    console.log('Native addon create repo result:', res)
    return res
  } catch (err) {
    console.error('Error creating git repository:', err)
    return { success: false, error: (err as GeneralError)?.message ?? String(err) }
  }
}
