const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    //fullscreen: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

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