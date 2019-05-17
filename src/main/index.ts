import {
  app,
  Menu,
  ipcMain,
  shell,
  BrowserWindow
} from 'electron'
import { AppWindow } from './app-window'
import {
  buildDefaultMenu,
  buildContextMenu,
  MenuEvent
} from './menu'
import { IMenuItem } from '../lib/menu-item'

let mainWindow: AppWindow | null = null

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  createMainWindow()

  let menu = buildDefaultMenu()
  Menu.setApplicationMenu(menu)

  ipcMain.on('menu-event', (event: Electron.IpcMessageEvent, args: any[]) => {
    const { name }: { name: MenuEvent } = event as any
    if (mainWindow) {
      mainWindow.sendMenuEvent(name)
    }
  })

  ipcMain.on(
    'open-external',
    (event: Electron.IpcMessageEvent, { path }: { path: string }) => {
      const result = shell.openExternal(path)
      event.sender.send('open-external-result', { result })
    }
  )

  ipcMain.on(
    'show-contextual-menu',
    (event: Electron.IpcMessageEvent, items: ReadonlyArray<IMenuItem>) => {
      const menu = buildContextMenu(items, ix =>
        event.sender.send('contextual-menu-action', ix)
      )

      const window = BrowserWindow.fromWebContents(event.sender)
      menu.popup({ window: window })
    }
  )

})

function createMainWindow() {
  const window = new AppWindow()

  window.onClose(() => {
    if (__DARWIN__) {
      app.quit()
    }
  })

  window.onDidLoad(() => {
    window.show()
  })
  window.load()

  mainWindow = window
}
