const { BrowserWindow, app, protocol, ipcMain } = require('electron')

const spotify = require('spotify-web-api-node');
const si = require('systeminformation');

const scopes = ['playlist-read-private', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'user-read-private']
const redirectUri = 'terminal://spotify'
const clientId = '45c838afe91345f38b82eb8959e9c750'
var state = 'tmp_state'

const spotifyAPI = new spotify({
	redirectUri: redirectUri,
	clientId: clientId,
	usePKCE: true
	// clientSecret: "8a3c083f109c49dd83ca48029ca643a0"
});

var callerEvent = null

var authWindow

app.on('ready', async () => {


	protocol.registerHttpProtocol('terminal', (request) => {
		// this protocol is used to communicate with spotify and other services on callbacks
		const code = request.url.split('?code=')[1].split('&state=')[0];
		// need to check state to prevent CSRF
		const returnedState = request.url.split('&state=')[1];
		if (returnedState !== state) {
			console.log('State does not match');
			return;
		}
		spotifyAPI.authorizationCodeGrant(code).then(
			(data) => {
				spotifyAPI.setAccessToken(data.body['access_token']);
				spotifyAPI.setRefreshToken(data.body['refresh_token']);
				storeRefreshToken(data.body['refresh_token']);

				if (callerEvent != null){
					callerEvent.reply("spotify.auth", {
						access_token: spotifyAPI.getAccessToken(),
					})
					authWindow.close();
				}
			}
		).catch((err) => {
				console.log(err)
			}
		)
	})

	ipcMain.on("spotify.auth", async (event) => {
		// check to see if we have a refresh token
		const refreshToken = await getRefreshToken();
		if (refreshToken != null) {
			spotifyAPI.setRefreshToken(refreshToken);
			spotifyAPI.refreshAccessToken().then(
				(data) => {
					spotifyAPI.setAccessToken(data.body['access_token']);
					event.reply("spotify.auth", {
						access_token: spotifyAPI.getAccessToken(),
					})
				}
			).catch(e => {
				si.inetChecksite("google.com").then((data) => {
					if(!data.ok){
						event.reply("spotify.auth", {
							access_token: null
						})
					}else{
						showAuthWindow(event);
					}
				}).catch(() => {
					event.reply("spotify.auth", {
						access_token: null
					})
				});
			})
			return;
		}else{
			showAuthWindow(event);
		}
	})

});

function showAuthWindow(event){
	authWindow = new BrowserWindow({
		width: 800,
		height: 600,
		fullscreen: false,
		show: false,
		'node-integration': false,
	});

	// set the state to something random of length 16
	state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	authWindow.loadURL(spotifyAPI.createAuthorizeURL(scopes, state));
	authWindow.show();
	callerEvent = event;
}

// create a function that uses keytar to store the refresh token
function storeRefreshToken(refreshToken) {
	const keytar = require('keytar');
	keytar.setPassword('spotify', 'refresh_token', refreshToken);
}

async function getRefreshToken() {
	const keytar = require('keytar');
	return await keytar.getPassword('spotify', 'refresh_token');
}