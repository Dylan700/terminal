import styles from '../assets/styles/progressbar.module.sass'

const ProgressBar = (props) => {

	return (
		<div className={props.vertical ? styles.verticalBarOuter : styles.horizontalBarOuter}>
			<div className={props.vertical ? styles.verticalBarInner : styles.horizontalBarInner} style={props.vertical ? { height: Math.round(props.progress || 0) + "%" } : {width: Math.round(props.progress || 0)+"%"}}>
			</div>
		</div>
	)
}

export default ProgressBar