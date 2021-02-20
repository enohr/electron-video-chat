const { app, BrowserWindow, ipcMain } = require('electron')

let win, modalScreen;

function createWindow () {
  homeWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    autoHideMenuBar: true,
    //fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  roomWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    autoHideMenuBar: true,
    show: false,
    //fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  modalScreen = new BrowserWindow({
    parent: win,
    modal: true,
    show: false,
    width: 1080,
    height: 720,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  })



  modalScreen.loadFile('pages/modal-screen/index.html')
  homeWindow.loadFile('pages/home/index.html')
  roomWindow.loadFile('pages/room-call/index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('join-room', (_, roomId) => {
  roomWindow.webContents.send('room-selected', roomId)
  homeWindow.hide();
  roomWindow.show();
})

ipcMain.on('open-modal', () => {
  modalScreen.show();
})

ipcMain.on('source-selected', (_, source) => {
  roomWindow.webContents.send('screen-source', source)
  modalScreen.close();
})