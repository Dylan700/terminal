import { useState, useEffect } from "react";
import Spacer from "../components/Spacer";
import AnimatedText from "./AnimatedText";

const Network = (props) => {
	const [network, setNetwork] = useState({ interfaces: [], networkGatewayDefault: ""});
	const [ping, setPing] = useState(null);
	const [publicIP, setPublicIP] = useState("0.0.0.0");


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
			setPing(Math.round(data) || null);
		}).catch(e => setPing(null))

		//get public ip
		getPublicIP().then((data) => {
			setPublicIP(data);
		})
	}

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
							<AnimatedText className="display text-medium text-primary">{publicIP}</AnimatedText>
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
								<AnimatedText className="display text-small">{item.ip4}</AnimatedText>
								<AnimatedText className="display text-tiny text-secondary">{item.ip6}</AnimatedText>
							</div>
							{item.mac &&
								<div className="col">
									<span className="display text-small text-secondary">MAC ADDRESS</span>
									<AnimatedText className="display text-small">{item.mac}</AnimatedText>
								</div>
							}
						</div>
					)
				})}
				<Spacer type={"top"} />
			</div>
		)
	}

	return getNetwork()
}

export default Network