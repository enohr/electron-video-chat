const { app, BrowserWindow, ipcMain } = require('electron')

let win, modalScreen;

function createWindow () {
  win = new BrowserWindow({
    width: 1080,
    height: 720,
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
    webPreferences: {
      nodeIntegration: true
    }
  })



  modalScreen.loadFile('pages/modal-screen/index.html')
  //win.loadFile('pages/home/index.html')
  win.loadFile('pages/room-call/index.html')
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

ipcMain.on('open-modal', (_, items) => {
  console.log(items)
  modalScreen.show();
})