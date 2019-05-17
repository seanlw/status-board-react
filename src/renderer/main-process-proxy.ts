import { ipcRenderer } from 'electron'
import { IMenuItem } from '../lib/menu-item'

let currentContextualMenuItems: ReadonlyArray<IMenuItem> | null = null

export function registerContextualMenuActionDispatcher() {
  ipcRenderer.on(
    'contextual-menu-action',
    (event: Electron.IpcMessageEvent, index: number) => {
      if (!currentContextualMenuItems) {
        return
      }
      if (index >= currentContextualMenuItems.length) {
        return
      }

      const item = currentContextualMenuItems[index]
      const action = item.action
      if (action) {
        action()
        currentContextualMenuItems = null
      }
    }
  )
}

export function showContextualMenu(items: ReadonlyArray<IMenuItem>) {
  currentContextualMenuItems = items
  ipcRenderer.send('show-contextual-menu', items)
}