const { ipcRenderer, contextBridge, clipboard } = require('electron')
const si = require('systeminformation');
const { getDoNotDisturb } = require('electron-notification-state')

contextBridge.exposeInMainWorld('electron', {
  terminal: {
    send: (payload) => ipcRenderer.send('terminal', payload),
    on: (handler) => ipcRenderer.on('terminal', handler),
    resize: (cols, rows) => ipcRenderer.send('terminal.resize', { cols, rows }),
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
    network: (cb) => si.get({ networkInterfaces: 'ip4, ip6, type, ifaceName, mac, internal', networkGatewayDefault: '*', networkStats: "rx_sec, tx_sec"}, cb),
    ping: (cb) => si.inetLatency('google.com', cb),
    docker: (cb) => si.get({dockerInfo: "containersRunning, images, containersPaused, containers, memTotal", dockerContainers: "name, state, id", mem: "total"}, cb),
    performance: (cb) => si.get({ currentLoad: "currentLoad", mem: "total, used", disksIO: "tIO_sec", processes: "list"}, cb),
    doNotDisturb: () => getDoNotDisturb(),
    clipboard: () => clipboard.readText(),
    
  },
  spotify: {
    authorize: () => ipcRenderer.send('spotify.auth'),
    onAuth: (cb) => ipcRenderer.on('spotify.auth', cb),
  },
  net: {
    ical: (url) => ipcRenderer.invoke('net.ical', url),
  },
  message: {
    send: (payload) => ipcRenderer.send('message', payload),
    on: (handler) => ipcRenderer.on('message', handler),
    off: (handler) => ipcRenderer.off('message', handler),
  }
})

