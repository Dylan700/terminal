import Terminal from './Terminal';

import { useTransition, animated } from 'react-spring'

const AnimatedTerminal = (props) => {
  const transition = useTransition(props.isActive, {
	from: { opacity: 0 },
	enter: { opacity: 1 },
	leave: { opacity: 0 },
	delay: props.delay,
  })

	return transition(
		(style, item) => item && <animated.div style={style}>{<Terminal {...props} />}</animated.div>
	)
}

export default AnimatedTerminal