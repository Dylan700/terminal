import { useTransition, animated } from 'react-spring'
import {useEffect} from 'react'

import introAudioFile from '../assets/audio/panels.mp3'
import exitAudioFile from '../assets/audio/scanFast.mp3'

const AnimatedPanel = (props) => {
	const introAudio = new Audio(introAudioFile);
	const exitAudio = new Audio(exitAudioFile);
	const transition = useTransition(props.isActive, {
		from: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		enter: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
		leave: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		delay: props.delay,
		config: { mass: 1, tension: 500, friction: 18 }
	});

	useEffect(() => {
		setTimeout(() => {
			if (props.isActive) {
				introAudio.currentTime = 0
				introAudio.volume = 1
				introAudio.play()
			} else {
				exitAudio.currentTime = 0
				exitAudio.volume = 0.5
				exitAudio.play()
			}
		}, props.delay)
	}, [props.isActive])

	return transition(
		(styles, item) => item && <animated.div style={styles}>{props.children}</animated.div>
	)
}

export default AnimatedPanel