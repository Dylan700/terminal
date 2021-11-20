const { TouchBar, BrowserWindow, ipcMain} = require('electron')

const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

var fullScreenToggle = false;

ipcMain.on('touchbar.fullscreen', (event, bool) => {
	fullScreenToggle = bool;
})

const fullScreenButton = new TouchBarButton({
	label: 'Toggle Focus Mode',
	backgroundColor: '#000000',
	click: () => {
		fullScreenToggle = !fullScreenToggle;
		BrowserWindow.getFocusedWindow().webContents.send('touchbar.fullscreen', fullScreenToggle)
	},
})

const touchBar = new TouchBar({
	items: [
		fullScreenButton,
	]
})

module.exports = touchBar