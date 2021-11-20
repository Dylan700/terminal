import { useState, useEffect } from "react";
import Spacer from "./Spacer";

import { useTransition, animated } from 'react-spring'
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import { FaSpotify } from "react-icons/fa";

import ProgressBar from "./ProgressBar";
import useTheme from "../contexts/theme";

import SpotifyAPI from "spotify-web-api-js"

const Spotify = (props) => {
	const {currentTheme} = useTheme();
	const api = new SpotifyAPI();

	const [spotify, setSpotify] = useState(null);
	const [isPremium, setIsPremium] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false);
	const [isAuthorizing, setIsAuthorizing] = useState(false);

	useEffect(() => {
		window.electron.spotify.onAuth((event, data) => {
			// save access token to local storage
			localStorage.setItem('access_token', data.access_token)
			setIsAuthorizing(false)
		})

		const interval = setInterval(async () => {
			if(await isAuthorized()){
				api.getMyCurrentPlaybackState().then(data => {
					setSpotify(data)
					setIsPlaying(data.is_playing)
				}).catch(e => setSpotify(null))

				api.getMe().then(d => setIsPremium(d.product === 'premium')).catch(e => setIsPremium(false))
			}else{
				if(!isAuthorizing){
					window.electron.spotify.authorize();
					setIsAuthorizing(true)
				}
			}
		}, 4000);

		return () => {
			clearInterval(interval);
		}
	}, [])

	const isAuthorized = async () => {
	if(localStorage.getItem('access_token')){
			api.setAccessToken(localStorage.getItem('access_token'));
			return await api.getMe().then(data => true).catch(e => false)
		}else{
			return false
		}
	}

	const logout = () => {
		localStorage.removeItem('access_token')
	}

	const play = () => {
		api.play().then(() => {
			setIsPlaying(true)
		}).catch(e => console.log(e))
	}

	const pause = () => {
		api.pause().then(() => {
			setIsPlaying(false)
		}).catch(e => console.log(e))
	}

	const getSpotify = () => {
		return (
			<div>
				{spotify && 
					<div>
						<Spacer type="bottom" />
						<div className="row">
							<div style={{margin: 10}}>
								<span className="display text-small">SPOTIFY</span>
							</div>
							<FaSpotify style={{marginRight: 10}} size={30} color={currentTheme.primaryColor} />
						</div>
						<Spacer type="vertical" />
						<div className="row">
							<div className="col" style={{flex: 3}}>
								<span className="display text-small">{spotify.item.name}</span>
								<span className="display text-tiny text-secondary">
									{spotify.item.artists.map(artist => artist.name).join(', ')}
								</span>
								<ProgressBar progress={(spotify.progress_ms/spotify.item.duration_ms) * 100} />

							</div>
							{isPremium && 
								<div className="col" style={{flex: 1}}>
									<div className="row" style={{justifyContent: "center"}}>
										<AiOutlineLeft size={30} color={currentTheme.primaryColor} />
										{isPlaying ?
											<AiFillPauseCircle size={30} color={currentTheme.primaryColor} onClick={() => {play()}} /> 
											:
											<AiFillPlayCircle size={30} color={currentTheme.primaryColor} onClick={() => {pause()}}/>
										}
										<AiOutlineRight size={30} color={currentTheme.primaryColor} />
									</div>
								</div>
							}
						</div>
						<Spacer type={"top"} />
					</div>
				}
				{!spotify &&
					<div>
						<Spacer type="bottom" />
						<div className="row">
							<div style={{ margin: 10 }}>
								<span className="display text-small">SPOTIFY <span className="display text-tiny text-secondary">OFFLINE</span></span>
							</div>
							<FaSpotify style={{ marginRight: 10 }} size={30} color={currentTheme.primaryColor} />
						</div>
						<Spacer type={"top"} />
					</div>
				}
			</div>
		)
	}

	return getSpotify()
}

export default Spotify