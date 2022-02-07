const { ipcMain } = require('electron');
const axios = require('axios');

ipcMain.handle('net.ical', async (event, url) => {
	try{
		const response = await axios.get(url);
		return response.data || null;
	}catch(e){
		return null;
	}
});