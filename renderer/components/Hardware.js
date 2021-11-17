import { useState, useEffect } from "react";
import Spacer from "../components/Spacer";

import {useTransition, animated} from 'react-spring'

import introAudioFile from '../assets/audio/panels.mp3'
import exitAudioFile from '../assets/audio/scanFast.mp3'

const Hardware = (props) => {
	const introAudio = new Audio(introAudioFile);
	const exitAudio = new Audio(exitAudioFile);
	const [hardware, setHardware] = useState({manufacturer: '', model: '', version: '', serial: ''});
	const transition = useTransition(props.isActive, {
		from: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		enter: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
		leave: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		delay: props.delay,
		config: { mass: 1, tension: 500, friction: 18 }
	});


  useEffect(() => {
	const hardwareStats = window.electron.system.hardware().then((data) => {
		setHardware({
			manufacturer: data.manufacturer,
			model: data.model,
			version: data.version,
			serial: data.serial
		})
	})
  }, []);

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

  const getHardware = () => {
	  return (
		  <div>
			  <div className="row">
				  <div className="col">
					  <span className="display text-small text-secondary">MANUFACTURER</span>
					  <span className="display text-small">{hardware.manufacturer}</span>
				  </div>
				  <div className="col">
					  <span className="display text-small text-secondary">MODEL</span>
					  <span className="display text-small">{hardware.model}</span>
				  </div>
			  </div>
			  <Spacer type={"top"} />
		  </div>
	  )
  }

	return transition(
		(styles, item) => item && <animated.div style={styles}>{getHardware()}</animated.div>
	)
}

export default Hardware