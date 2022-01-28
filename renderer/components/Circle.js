import styles from '../assets/styles/circle.module.sass';

import { useEffect, useState } from 'react';
import useTheme from '../contexts/theme';

const Circle = (props) => {
	const {currentTheme} = useTheme()
	const progress = Number.isNaN(props.progress) ? 0 : props.progress
	const stroke = 3
	const radius = 50
	const normalizedRadius = radius - stroke * 2;
	const circumference = normalizedRadius * 2 * Math.PI;

	const [strokeDashoffset, setStrokeDashoffset] = useState(circumference - progress / 100 * circumference)

	useEffect(() => {
		setStrokeDashoffset(circumference - progress / 100 * circumference)
	}, [progress])

	return(
		<svg
			height={radius * 2}
			width={radius * 2}
		>
			<g>
			<circle
				className={styles.circle}
				stroke={currentTheme.primaryColor}
				fill="transparent"
				strokeWidth={stroke}
				strokeDasharray={circumference + ' ' + circumference}
				style={{ strokeDashoffset }}
				r={normalizedRadius}
				cx={radius}
				cy={radius}
			/>
				<text x="50%" y="50%" alignmentBaseline="middle" className="display text-small" textAnchor="middle" fill={currentTheme.primaryColor} >
					{progress}%
				</text>
				{props.info && <text x="50%" y="65%" alignmentBaseline="middle" className="display text-tiny" textAnchor="middle" fill={currentTheme.secondaryColor} >
					{props.info}
				</text>
				}
			</g>
		</svg>
	)
}

export default Circle