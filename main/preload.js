const { ipcRenderer, contextBridge } = require('electron')
const si = require('systeminformation');

contextBridge.exposeInMainWorld('electron', {
  terminal: {
    send: (payload) => ipcRenderer.send('terminal', payload),
    on: (handler) => ipcRenderer.on('terminal', handler),
    resize: (cols, rows) => ipcRenderer.send('terminal.resize', { cols, rows }),
  },
  system: {
    time: () => si.time(),
    os: (cb) => si.osInfo(cb),
    battery: (cb) => si.battery(cb),
    hardware: (cb) => si.system(cb),
    network: (cb) => si.get({ networkInterfaces: 'ip4, ip6, type, ifaceName, mac, internal', networkGatewayDefault: '*'}, cb),
    ping: (cb) => si.inetChecksite('google.com', cb),
    docker: (cb) => si.get({dockerInfo: "containersRunning, images, containersPaused, containers, memTotal", dockerContainers: "name, state, id", mem: "total"}, cb),
    performance: (cb) => si.get({ currentLoad: "currentLoad", mem: "total, used", fsStats: "tx_sec"}, cb),
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

