import styles from '../assets/styles/grid.module.sass';

const Grid = (props) => {
	return (
		<div className={styles.container}>
			{props.children}
		</div>
	)
}


export default Grid;
