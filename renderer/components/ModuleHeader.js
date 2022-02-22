import styles from '../assets/styles/moduleHeader.module.sass';
import AnimatedText from './AnimatedText';

import { useTransition, animated, config } from 'react-spring'

const ModuleHeader = (props) => {

	const blockTransition = useTransition(props.isActive, {
		from: { height: "0%" },
		enter: { height: "100%" },
		leave: { height: "0%" },
		config: config.default
	})

	const lineTransition = useTransition(props.isActive, {
		from: { width: "0%" },
		enter: { width: "100%" },
		leave: { width: "0%" },
		config: config.default
	})

	const opacityTransition = useTransition(props.isActive, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: config.default
	})


	return (
		<div>
			<div className={styles.lineContainer}>
				<div className={styles.line1}>
					{blockTransition(
						(style, item) => item && <animated.div style={style} className={styles.block}></animated.div>
					)}
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<AnimatedText className="text-secondary text-tiny">{props.isActive ? props.subtitle : ""}</AnimatedText>
						<AnimatedText className="text-primary display">{props.isActive ? props.title : ""}</AnimatedText>
					</div>
					<div className={styles.line2}></div>
				</div>

				{props.id && opacityTransition(
					(style, item) => item && <animated.div style={style} className={styles.tab}><span className={styles.tabText}>{props.id}</span></animated.div>
				)}
				
			</div>
			{lineTransition(
				(style, item) => item && <animated.div style={style} className={styles.line4}></animated.div>
			)}
		</div>
	)

}

export default ModuleHeader;