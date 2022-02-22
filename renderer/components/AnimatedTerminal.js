import Terminal from './Terminal';

import { useTransition, animated, config } from 'react-spring'
import useSettings from '../contexts/settings';

const AnimatedTerminal = (props) => {
  const { currentSettings, setSettings } = useSettings()

  const transition = useTransition(props.isActive, {
	from: { opacity: 0 },
	enter: { opacity: 1 },
	leave: { opacity: 0 },
	delay: props.delay,
	config: config.molasses
  })

	return transition(
		(style, item) => item && <animated.div className="fullHeight" style={style}>{<Terminal useAudio={currentSettings.enableAudio} {...props} />}</animated.div>
	)
}

export default AnimatedTerminal