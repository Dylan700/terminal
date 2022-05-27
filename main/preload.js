const { ipcRenderer, contextBridge, clipboard, webFrame } = require('electron')
const si = require('systeminformation');
const fs = require('fs');
const os = require('os');

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
    performance: (cb) => si.get({ currentLoad: "currentLoad", mem: "total, used", disksIO: "tIO_sec", processes: "list", cpu: "manufacturer, model, core, physicalCores"}, cb),
    doNotDisturb: () => false,
    clipboard: () => clipboard.readText(),
    username: () => os.userInfo().username,
  },
  file: {
    // read the file and return the data as JSON parsed
    json: (path) => {
      return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(data))
          }
        })
      })
    }
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
  },
  zoom: {
    set: (zoom) => webFrame.setZoomFactor(zoom),
  }
})

