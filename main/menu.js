const { Menu, app, BrowserWindow, dialog } = require('electron');
const isDev = require('electron-is-dev');

const menuArray = [
	{
		label: "Nexus",
		submenu: [
			{
				label: "Quit",
				accelerator: "CmdOrCtrl+Q",
				click: function() {
					app.quit();
				}
			}
		],
	},
	{
		label: 'About',
		submenu: [
			{
				label: 'About',
				click: () => {
					dialog.showMessageBox({
						type: 'info',
						icon: '../renderer/assets/icons/logo.png',
						title: 'Nexus - About',
						message: 'About Nexus V0.0.1 - Beta Edition',
						detail: `Nexus is an electron powered, SciFi terminal, designed to be usable while also providing awesomeness.

Features include:
	- Custom Themes and Layouts
	- Spotify Integration
	- ICAL Calendar Integration
	- CPU and Network Stats
	- Docker Stats
	- Audio Feedback and SFX
	- And much more!

This app was created by Dylan Williams, and is inspired by (the no longer maintained) eDEX-UI project.

** WARNING ** 
This is a beta version, and is not intended for use in production. Any harm done to your computer is your own responsibility, use at your own risk.  This app is not to be used for any malicious or illegal purposes, and redistribution of this app without the explict permission from the author (Dylan Williams) is strictly prohibited. You are encouraged to report any bugs, issues, or other problems you may find.
`,
						buttons: ['OK']
					}, (res) => {});
				}
			}
		]
	},
	{
		label: 'Help',
		submenu: [
			{
				label: "Commands",
				click: () => {
					dialog.showMessageBox({
						type: 'info',
						icon: '../renderer/assets/icons/logo.png',
						title: 'Nexus - Commands',
						message: 'Nexus Commands',
						detail: `Settings (CMD/CTRL + ,) - Opens the settings menu

Toggle Focus Mode (CMD/CTRL + \\) - Toggles the focus mode which will expand the terminal to fill the entire screen

Show/Hide Nexus (Double Tap CMD/CTRL + ENTER) - Hides/Shows the Nexus window (can be used even when the app is not focused)
`,
					});
				}
			}]
	},
];

if(isDev){
	menuArray.push({
		label: 'Debug',
		submenu: [
			{
				label: 'View Dev Tools',
				accelerator: 'CmdOrCtrl+I',
				click: () => {
					BrowserWindow.getFocusedWindow()?.webContents?.openDevTools();
				}
			}
		]
	});
}

// create new menu with About menu item
const menu = Menu.buildFromTemplate(menuArray);

Menu.setApplicationMenu(menu);