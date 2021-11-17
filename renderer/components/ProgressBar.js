import styles from '../assets/styles/progressbar.module.sass'

const ProgressBar = (props) => {
	return (
		<div className={styles.progressBarOuter}>
			<div className={styles.progressBarInner} style={{width: Math.round(props.progress || 0)+"%"}}>
			</div>
		</div>
	)
}

export default ProgressBar