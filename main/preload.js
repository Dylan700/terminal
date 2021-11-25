const { ipcRenderer, contextBridge } = require('electron')
const si = require('systeminformation');
const { getDoNotDisturb } = require('electron-notification-state')

contextBridge.exposeInMainWorld('electron', {
  terminal: {
    send: (ptyIndex, payload) => ipcRenderer.send('terminal', ptyIndex, payload),
    on: (handler) => ipcRenderer.on('terminal', handler),
    resize: (ptyIndex, cols, rows) => ipcRenderer.send('terminal.resize', ptyIndex, {cols, rows}),
    create: () => ipcRenderer.send('terminal.create'),
    onCreate: (handler) => ipcRenderer.on('terminal.create', handler),
    destroy: () => ipcRenderer.send('terminal.destroy'),
  },
  touchbar: {
    onFullScreen: (handler) => ipcRenderer.on('touchbar.fullscreen', handler),
    sendFullScreen: (bool) => ipcRenderer.send('touchbar.fullscreen', bool), 
  },
  system: {
    time: () => si.time(),
    os: (cb) => si.osInfo(cb),
    battery: (cb) => si.battery(cb),
    hardware: (cb) => si.system(cb),
    network: (cb) => si.get({ networkInterfaces: 'ip4, ip6, type, ifaceName, mac, internal', networkGatewayDefault: '*'}, cb),
    ping: (cb) => si.inetLatency('google.com', cb),
    docker: (cb) => si.get({dockerInfo: "containersRunning, images, containersPaused, containers, memTotal", dockerContainers: "name, state, id", mem: "total"}, cb),
    performance: (cb) => si.get({ currentLoad: "currentLoad", mem: "total, used", fsStats: "tx_sec"}, cb),
    doNotDisturb: () => getDoNotDisturb(),
    
  },
  spotify: {
    authorize: () => ipcRenderer.send('spotify.auth'),
    onAuth: (cb) => ipcRenderer.on('spotify.auth', cb),
  },
  message: {
    send: (payload) => ipcRenderer.send('message', payload),
    on: (handler) => ipcRenderer.on('message', handler),
    off: (handler) => ipcRenderer.off('message', handler),
  }
})

