import { useState, useEffect } from "react";

import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import { FaSpotify } from "react-icons/fa";

import ProgressBar from "./ProgressBar";
import useTheme from "../contexts/theme";

import SpotifyAPI from "spotify-web-api-js"
import AnimatedText from "./AnimatedText";
import ModuleHeader from "./ModuleHeader";
import AnimatedPanel from "./AnimatedPanel";

const Spotify = (props) => {
	const {currentTheme} = useTheme();
	const api = new SpotifyAPI();

	const [spotify, setSpotify] = useState(null);
	const [isPremium, setIsPremium] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false);
	const [isAuthorizing, setIsAuthorizing] = useState(false);

	useEffect(() => {
		window.electron.spotify.onAuth((event, data) => {
			if(data.access_token != null){
				// save access token to local storage
				localStorage.setItem('access_token', data.access_token)
			}
			setIsAuthorizing(false)
		})
	}, [])

	useEffect(() => {
		const interval = setInterval(async () => {
			if (await isAuthorized()) {
				api.getMyCurrentPlaybackState({"additional_types": "episode"}).then(data => {
					setSpotify(data)
					setIsPlaying(data.is_playing)
				}).catch(e => setSpotify(null))

				api.getMe().then(d => setIsPremium(d.product === 'premium')).catch(e => setIsPremium(false))
			} else {
				if (!isAuthorizing) {
					setIsAuthorizing(true)
					window.electron.spotify.authorize();
				}
			}
		}, 4000);

		return () => {
			clearInterval(interval);
		}
	}, [isAuthorizing])

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

	const getStatus = () => {
		if (spotify != null) {
			if (spotify.currently_playing_type === "track") {
				return "LISTENING TO MUSIC";
			}else if(spotify.currently_playing_type === "episode"){
				return "LISTENING TO A PODCAST";
			}else if(spotify.currently_playing_type === "ad"){
				return "PLAYING ADVERTISEMENT";
			}else {
				return "OFFLINE";
			}
		}else{
			return "OFFLINE";
		}
	}

	const getSpotify = () => {
		return (
			<div>
				<ModuleHeader isActive={props.isActive} delay={props.delay} title="SPOTIFY" subtitle={getStatus()} id={<FaSpotify style={{width: "40px", height: "40px"}}/>}/>
				<AnimatedPanel isActive={props.isActive} delay={props.delay}>
					{spotify && (spotify.currently_playing_type === "track" || spotify.currently_playing_type === "episode") &&
						<div>
							<div className="row">
								<div className="col">
									<img className="image-color" src={spotify.item.album ? spotify.item.album.images[2].url : spotify.item.images[2].url} height={50} width={50}></img>
									<div className="image-color-overlay" style={{width: "50px", height:"50px"}}></div>
								</div>
								<div className="col" style={{flex: 3}}>
									<AnimatedText className="display text-small">{spotify.item.name}</AnimatedText>
									<span className="display text-tiny text-secondary">
										{spotify.item.artists &&
											<AnimatedText>{spotify.item.artists.map(artist => artist.name).join(', ')}</AnimatedText>
										}
										{spotify.item.description &&
											<marquee scrollamount={2}>{spotify.item.description}</marquee>
										}
									</span>
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
							<div className="row" style={{marginLeft: "10px", marginRight: "10px"}}>
								<ProgressBar progress={(spotify.progress_ms / spotify.item.duration_ms) * 100} />
							</div>
						</div>
					}
				</AnimatedPanel>
			</div>
		)
	}

	return getSpotify()
}

export default Spotify