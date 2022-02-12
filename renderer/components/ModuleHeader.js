import styles from '../assets/styles/moduleHeader.module.sass';

const ModuleHeader = (props) => {

	return (
		<div className={styles.lineContainer}>
			<div className={styles.line1}>
				<div className={styles.block}></div>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<span className="text-secondary text-small">{props.subtitle}</span>
					<span className="text-primary display">{props.title}</span>
				</div>
				<div className={styles.line2}></div>
			</div>
			<div className={styles.line3}>
				<div className={styles.tab}>
					<span className={styles.tabText}>{props.id || "A1"}</span>
				</div>
			</div>

		</div>
	)

}

export default ModuleHeader;