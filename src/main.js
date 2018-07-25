const electron = require('electron')

let app = electron.app
let BrowserWindow = electron.BrowserWindow

let win

function createWindow() {
    win = new BrowserWindow({
        width: 600,
        height: 300,
        frame: true,
        titleBarStyle: "hidden",
        maximizable: false,
        resizable: false,
    })

    win.loadFile('public/index.html')

    win.webContents.openDevTools()

    win.on('closed', () => win = null)
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

let timerActive = false

global.isTimerActive = function() {
    return timerActive
}

global.setTimerActive = function(isActive) {
    timerActive = isActive
}
