const {app, ipcMain} = require('electron');
const pty = require('node-pty');
const os = require('os');
const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];

// each terminal contains an object with an event and a ptyProcess
let terminals = [];

ipcMain.on('terminal.create', (event) => {
	const ptyProcess = createPty();
	terminals.push({
		event: null,
		ptyProcess: ptyProcess
	});

	// get index of this ptyProcess in terminals
	const index = terminals.length - 1;

	ptyProcess.onData((data) => {
		if(terminals[index].event) {
			terminals[index].event.reply('terminal', data);
		}
	})
	
	ptyProcess.onExit((code) => {
		terminals.splice(index, 1);
		if(terminals.length === 0) {
			app.quit();
		}
	});

	event.reply('terminal.created', index);
	
});

ipcMain.on('terminal.destroy', (event) => {
	terminals = terminals.filter(t => t.event !== event);
})

ipcMain.on('terminal', (event, terminalIndex, data) => {
	var terminal = terminals[terminalIndex];
	if(terminal){
		terminal.ptyProcess.write(data);
		terminals[terminalIndex].event = event;
	}
});

ipcMain.on('terminal.resize', (event, terminalIndex, size) => {
	var terminal = terminals[terminalIndex];
	if(terminal){
		terminal.ptyProcess.resize(size.cols, size.rows);
	}
});

const createPty = () => {
	const ptyProcess = pty.spawn(shell, [], {
		name: 'xterm-color',
		cols: 100,
		rows: 40,
		cwd: process.cwd(),
		env: process.env
	});
	// set pty to home directory
	ptyProcess.write("cd ~\n");
	if (os.platform() === 'darwin') {
		ptyProcess.write("export PATH=/usr/local/bin:$PATH\n")
	}
	return ptyProcess;
}