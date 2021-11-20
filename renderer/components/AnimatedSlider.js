import { useEffect, useState } from 'react';
import { useTransition, animated, config } from 'react-spring'

const AnimatedSlider = (props) => {
	const [width, setWidth] = useState(0);
	const [element, setElement] = useState(null);

	useEffect(() => {
		if(element){
			setWidth(element.clientWidth);
		}

	}, [element])

	const transition = useTransition(props.isActive, {
		from: { opacity: 0, transform: `translate3d(0, -${width+100}px, 0)`},
		enter: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
		leave: { opacity: 0, transform: `translate3d(0, -${width+100}px, 0)`},
		config: config.molasses
	});

	return transition(
		(styles, item) => item && <animated.div ref={c => setElement(c)} className={props.className} style={{...props.style, styles}}>{props.children}</animated.div>
	)
}

export default AnimatedSlider