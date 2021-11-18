const { BrowserWindow, app, protocol, ipcMain } = require('electron')

const spotify = require('spotify-web-api-node');

const scopes = ['playlist-read-private', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'user-read-private'],
	redirectUri = 'terminal://spotify',
	clientId = '45c838afe91345f38b82eb8959e9c750',
	state = 'somestate';

const spotifyAPI = new spotify({
	redirectUri: redirectUri,
	clientId: "45c838afe91345f38b82eb8959e9c750",
	clientSecret: "it's a secret isn't it?"
});

var callerEvent = null

app.on('ready', async () => {

	var authWindow = new BrowserWindow({
		width: 800,
		height: 600,
		fullscreen: false,
		show: false,
		'node-integration': false,
	});


	protocol.registerHttpProtocol('terminal', (request) => {
		// this protocol is used to communicate with spotify and other services on callbacks
		const code = request.url.split('?code=')[1].split('&state=')[0];
		// need to check state to prevent CSRF
		const state = request.url.split('&state=')[1];
		if (state !== 'somestate') {
			console.log('State does not match');
			return;
		}
		spotifyAPI.authorizationCodeGrant(code).then(
			(data) => {
				spotifyAPI.setAccessToken(data.body['access_token']);
				spotifyAPI.setRefreshToken(data.body['refresh_token']);
				if (callerEvent != null){
					callerEvent.reply("spotify.auth", {
						access_token: spotifyAPI.getAccessToken(),
						refresh_token: spotifyAPI.getRefreshToken()
					})
					authWindow.close();
				}
			}
		).catch((err) => {
				console.log(err)
			}
		)
	})


	ipcMain.on("spotify.auth", (event) => {
		authWindow.loadURL(spotifyAPI.createAuthorizeURL(scopes, state));
		authWindow.show();
		callerEvent = event;
	})

});