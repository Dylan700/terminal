import { useState } from 'react';
import styles from '../assets/styles/tooltip.module.sass';

import audioFile from '../assets/audio/panels.mp3'

const Tooltip = (props) => {

	const audio = new Audio(audioFile);

	const {title, subtitle, description} = props;
	const [isOpen, setOpen] = useState(false);
	const [lastPlayed, setLastPlayed] = useState(new Date());

	const enter = () => {
		setOpen(true);
		if(lastPlayed < new Date() - 1000) {
			audio.currentTime = 0
			audio.volume = 0.5
			audio.play()
			setLastPlayed(new Date());
		}
	}

	const exit = () => {
		setOpen(false);
		if (lastPlayed < new Date() - 250) {
			setTimeout(() => {
				audio.currentTime = 0
				audio.volume = 0.3
				audio.play()
				setLastPlayed(new Date());
			}, 375)
		}
	}

	return (
		<div onMouseEnter={enter} onMouseLeave={exit} className={styles.tt_wrapper}>
			<div className={`${styles.tt} ${isOpen ? styles.active : ""}`}>
				<p className="display text-medium">{title}</p>
				<p className="display text-small text-secondary">{subtitle}</p>
				<p className="display text-tiny text-secondary">{description}</p>
			</div>
			{props.children}
		</div>
	)
}

export default Tooltip;

