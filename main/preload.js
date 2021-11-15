const { ipcRenderer, contextBridge } = require('electron')
const os = require('os')

contextBridge.exposeInMainWorld('electron', {
  terminal: {
    send: (payload) => ipcRenderer.send('terminal', payload),
    on: (handler) => ipcRenderer.on('terminal', handler),
    resize: (cols, rows) => ipcRenderer.send('terminal.resize', { cols, rows }),
  },
  system: {
    uptime: () => os.uptime(),
  },
  message: {
    send: (payload) => ipcRenderer.send('message', payload),
    on: (handler) => ipcRenderer.on('message', handler),
    off: (handler) => ipcRenderer.off('message', handler),
  }
})
