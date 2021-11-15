// Native
const { join } = require('path')
const { format } = require('url')

// Packages
const { BrowserWindow, app, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
    fullscreen: true,
  })

  const url = isDev
    ? 'http://localhost:8000'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })

  mainWindow.loadURL(url)
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event, message) => {
  event.sender.send('message', message)
})


const pty = require('node-pty');
const os = require('os');
const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 100,
  rows: 40,
  cwd: process.cwd(),
  env: process.env
});

var xtermEvent;

// set pty to home directory
ptyProcess.write("cd ~\n");
if(os.platform() === 'darwin'){
  ptyProcess.write("export PATH=/usr/local/bin:$PATH\n")
}

ipcMain.on('terminal', (event, data) => {
  ptyProcess.write(data);
  xtermEvent = event;
});

ptyProcess.onData((data) => {
  if (xtermEvent != null) {
    xtermEvent.reply('terminal', data);
  }
});

ipcMain.on('terminal.resize', (event, size) => {
  ptyProcess.resize(size.cols, size.rows);
});

ptyProcess.onExit((code) => {
  app.quit();
});