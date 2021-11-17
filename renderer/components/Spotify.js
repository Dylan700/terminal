import { useState, useEffect } from "react";
import Spacer from "./Spacer";

import { useTransition, animated } from 'react-spring'
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import { FaSpotify } from "react-icons/fa";

import introAudioFile from '../assets/audio/panels.mp3'
import exitAudioFile from '../assets/audio/scanFast.mp3'
import ProgressBar from "./ProgressBar";
import useTheme from "../contexts/theme";

const Spotify = (props) => {
	const {currentTheme} = useTheme();
	const introAudio = new Audio(introAudioFile);
	const exitAudio = new Audio(exitAudioFile);
	const transition = useTransition(props.isActive, {
		from: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		enter: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
		leave: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		delay: props.delay,
		config: { mass: 1, tension: 500, friction: 18 }
	});

	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			if (props.isActive) {
				introAudio.currentTime = 0
				introAudio.volume = 1
				introAudio.play();
			} else {
				exitAudio.currentTime = 0
				exitAudio.volume = 0.5
				exitAudio.play();
			}
		}, props.delay);
	}, [props.isActive])

	const getSpotify = () => {
		return (
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
						<span className="display text-small">SOME TRACK NAME GOES HERE</span>
						<span className="display text-tiny text-secondary">THE ARTIST IS HERE</span>
						<ProgressBar progress={50} />

					</div>
					<div className="col" style={{flex: 1}}>
						<div className="row" style={{justifyContent: "center"}}>
							<AiOutlineLeft size={30} color={currentTheme.primaryColor} />
							{isPlaying ?
								 <AiFillPauseCircle size={30} color={currentTheme.primaryColor} onClick={() => {setIsPlaying(false)}} /> 
								:
								<AiFillPlayCircle size={30} color={currentTheme.primaryColor} onClick={() => {setIsPlaying(true)}}/>
							}
							<AiOutlineRight size={30} color={currentTheme.primaryColor} />
						</div>
					</div>
				</div>
				<Spacer type={"top"} />
			</div>
		)
	}

	return transition(
		(styles, item) => item && <animated.div style={styles}>{getSpotify()}</animated.div>
	)
}

export default Spotify