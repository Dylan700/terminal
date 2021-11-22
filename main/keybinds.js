const { app, globalShortcut, BrowserWindow } = require('electron')

let firstFullScreenClick = null;

const onFullScreenPress = () => {
	if (firstFullScreenClick && (Date.now() - firstFullScreenClick) < 200) {
		firstFullScreenClick = null;
		BrowserWindow.getAllWindows().forEach(window => {
			if(window.isFocused()) {
				window.hide();
			}else{
				window.setVisibleOnAllWorkspaces(true);
				window.show();
				window.setVisibleOnAllWorkspaces(false);
			}
		});
	} else {
		firstFullScreenClick = Date.now();
	}
};

app.on("ready", () => {
	globalShortcut.register('Command+Enter', onFullScreenPress);
});