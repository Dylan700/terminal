import { useEffect, useState } from "react";

const AnimatedText = (props) => {

	const scramble = (str) => {
		var scrambled = "";
		var skip = [" ", ".", ";", ":", "!", "\"", "'", ","];
		for (var i = 0; i < str.length; i++) {
			if (skip.indexOf(str.charAt(i)) !== -1) {
				scrambled += str.charAt(i);
				continue;
			}
			scrambled += String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65));
		}

		return scrambled;
	}

	const [state, setState] = useState({textValue: props.children, scrambled: scramble(props.children), currentTextValue: ""})

	const [revealInterval, setRevealInterval] = useState();
	const [decodeInterval, setDecodeInterval] = useState();

	const decode = () => {
		let interval = setInterval(() => {
			setState((prev) => {
				for (var i = 0; i < prev.currentTextValue.length; i++) {
					if (prev.currentTextValue.charAt(i) !== prev.textValue.charAt(i)) {
						var newText = prev.textValue.substring(0, i + 1) + prev.scrambled.substring(i, prev.scrambled.length);
						return {...prev, currentTextValue: newText};
					}
				}

				clearInterval(interval);
				return prev;
			});

		}, 25);

		setDecodeInterval(interval);
	}

	const reveal = () => {
		let interval = setInterval(() => {
			setState((prev) => {
				if (prev.currentTextValue.length < prev.scrambled.length) {
					var newText = prev.scrambled.substring(0, prev.currentTextValue.length + 1);
					return {...prev, currentTextValue: newText};
				} else {
					clearInterval(interval);
					decode();
					return prev;
				}
			});
		}, 20);

		setRevealInterval(interval);
	}

	useEffect(() => {
		// need to clear all intervals before re-rendering
		clearInterval(revealInterval);
		clearInterval(decodeInterval);
		setState((prev) => {
			return {textValue: props.children, scrambled: scramble(props.children), currentTextValue: ""}
		})
		reveal();
	}, [props.children])

	return(
		<span className={props.className} style={props.style}>{state.currentTextValue}</span>
	)

}

export default AnimatedText;