const { BrowserWindow, app, protocol, ipcMain } = require('electron')

const si = require('systeminformation');
const fetch = require('electron-fetch').default

const base_uri = 'https://accounts.spotify.com/api/';
const auth_uri = 'https://accounts.spotify.com/authorize';
const scopes = ['playlist-read-private', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'user-read-private']
const redirectUri = 'terminal://spotify'
const clientId = '45c838afe91345f38b82eb8959e9c750'

var state = 'tmp_state'
var codeChallenge = "tmp_challenge"
var codeVerifier = "tmp_verifier"
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
		getCodeGrant(code).then(
			(data) => {
				if(data.access_token){
					storeRefreshToken(data.refresh_token);
					if (callerEvent != null){
						callerEvent.reply("spotify.auth", {
							access_token: data.access_token,
						})
						authWindow.close();
					}
				}else{
					callerEvent.reply("spotify.auth", {
						access_token: null,
					})
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
			refreshAccessToken(refreshToken).then(
				(data) => {
					if(data.refresh_token){
						storeRefreshToken(data.refresh_token);
					}
					if (data.access_token){
						event.reply("spotify.auth", {
							access_token: data.access_token,
						})
					}else{
						showAuthWindow(event);
					}
				}
			).catch(e => {
				event.reply("spotify.auth", {
					access_token: null
				})
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

	authWindow.loadURL(getAuthorizationURL(scopes));
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

// this function returns a string of the authorization url
function getAuthorizationURL(scopes) {
	const pkceChallenge = require("pkce-challenge");
	challenge = pkceChallenge();
	codeVerifier = challenge.code_verifier;
	codeChallenge = challenge.code_challenge;
	// set the state to something random of length 16
	state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	const url = auth_uri + '?client_id=' + clientId + '&response_type=code&redirect_uri=' + redirectUri + '&scope=' + scopes.join('%20') + '&state=' + state + "&code_challenge_method=S256" + "&code_challenge=" + codeChallenge;	
	return url;
}

// get an access token/refresh token and other data using a code grant
async function getCodeGrant(code){
	// send a post request to /api/token, with the code, grant_type, and redirect_uri, client_id and code_verifier
	const response = await fetch(base_uri + 'token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + redirectUri + '&client_id=' + clientId + '&code_verifier=' + codeVerifier,
	});

	// return the response
	return await response.json();
}

// get a new access token using a refresh token
async function refreshAccessToken(refreshToken){
	// send a post request to /api/token, with the refresh_token, grant_type, and redirect_uri, client_id and code_verifier
	const response = await fetch(base_uri + 'token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: 'grant_type=refresh_token&refresh_token=' + refreshToken + '&client_id=' + clientId,
	});
	// return the response
	return await response.json();
}