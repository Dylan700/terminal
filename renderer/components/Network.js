import { useState, useEffect } from "react";
import Spacer from "../components/Spacer";

import { useTransition, animated } from 'react-spring'

import introAudioFile from '../assets/audio/panels.mp3'
import exitAudioFile from '../assets/audio/scanFast.mp3'

const Hardware = (props) => {
	const introAudio = new Audio(introAudioFile);
	const exitAudio = new Audio(exitAudioFile);
	const [network, setNetwork] = useState({ interfaces: [], networkGatewayDefault: ""});
	const [ping, setPing] = useState(null);
	const [publicIP, setPublicIP] = useState("0.0.0.0");
	const transition = useTransition(props.isActive, {
		from: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		enter: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
		leave: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		delay: props.delay,
		config: { mass: 1, tension: 500, friction: 18 }
	});


	useEffect(() => {
		setNetworkStats();
		const interval = setInterval(() => {
			setNetworkStats();
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	const setNetworkStats = () => {
		const networkStats = window.electron.system.network().then((data) => {
			const filteredData = data.networkInterfaces.filter((item) => {
				return item.ip4 !== "";
			})
			setNetwork({ interfaces: filteredData, networkGatewayDefault: data.networkGatewayDefault });
		})

		window.electron.system.ping().then((data) => {
			setPing(data.ms);
		})

		//get public ip
		getPublicIP().then((data) => {
			setPublicIP(data);
		})
	}

	useEffect(() => {
		setTimeout(() => {
			if(props.isActive) {
				introAudio.currentTime = 0
				introAudio.volume = 1
				introAudio.play();
			}else{
				exitAudio.currentTime = 0
				exitAudio.volume = 0.5
				exitAudio.play();
			}
		}, props.delay);
	}, [props.isActive])


	const getPublicIP = async () => {
		const url = "https://api.ipify.org?format=json";
		try {
			const response = await fetch(url);
			const data = await response.json();
			return data.ip;
		}catch (error) {
			return "0.0.0.0"
		}

	}

	const getNetwork = () => {
		return (
			<div>
				<div className="row">
					{ping &&
						<div className="col" style={{ alignItems: 'flex-end' }}>
							<span className="display text-tiny text-secondary">PUBLIC ADDRESS</span>
							<span className="display text-medium text-primary">{publicIP}</span>
						</div>
					}
					{ping &&
						<div className="col" style={{ alignItems: 'flex-end' }}>
								<span className="display text-tiny text-secondary">PING</span>
								<span className="display text-medium text-primary">{ping}ms</span>
						</div>
					}
					{!ping &&
						<div className="col" style={{ alignItems: 'flex-end' }}>
							<span className="display text-tiny text-secondary">OFFLINE</span>
						</div>
					}
				</div>
				<Spacer type={"bottom"} />
				{network.interfaces.map((item, index) => {
					return (
						<div key={index} className="row">
							<div className="col">
								<span className="display text-small text-secondary">{item.ifaceName} <span className="text-tiny text-secondary">{item.type}</span></span>
								<span className="display text-small">{item.ip4}</span>
								<span className="display text-tiny text-secondary">{item.ip6}</span>
							</div>
							{item.mac &&
								<div className="col">
									<span className="display text-small text-secondary">MAC ADDRESS</span>
									<span className="display text-small">{item.mac}</span>
								</div>
							}
						</div>
					)
				})}
				<Spacer type={"top"} />
			</div>
		)
	}

	return transition(
		(styles, item) => item && <animated.div style={styles}>{getNetwork()}</animated.div>
	)
}

export default Hardware