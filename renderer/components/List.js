import styles from "../assets/styles/list.module.sass";
import AnimatedText from "./AnimatedText";

const ListContainer = (props) => {

	return (
		<div>
			<div className="row align-center">
				<div className="col" style={{width: "100%"}}>
					<div className={styles.line}></div>
				</div>
				<div className="col">
					{props.title}
				</div>
				<div className="col" style={{ width: "100%" }}>
					<div className={styles.line}></div>
				</div>
			</div>
			<div className={styles.itemContainer}>
				{props.children}
			</div>
		</div>
	)

}

const ListItem = (props) => {

	return (
		<div className={styles.item}>
			<div className={styles.itemInnerLeft}>
				<AnimatedText className="text-small">{props.name1}</AnimatedText>
				<AnimatedText className="text-tiny text-secondary">{props.value1}</AnimatedText>
			</div>
			<div className={styles.itemInnerRight}>
				<AnimatedText className="text-small">{props.name2}</AnimatedText>
				<AnimatedText className="text-tiny text-secondary">{props.value2}</AnimatedText>
			</div>
				{props.focus &&
						<div className={styles.itemActive}></div>

				}
				{props.focus &&
					<div className={styles.itemActiveIndicator}></div>

				}
		</div>
	)
}

export { ListContainer, ListItem};