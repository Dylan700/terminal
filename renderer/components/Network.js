import { useState, useEffect } from "react";
import Spacer from "../components/Spacer";
import ProgressBar from "./ProgressBar";
import {ListContainer, ListItem} from "./List";
import ModuleHeader from "./ModuleHeader";
import AnimatedPanel from "./AnimatedPanel";

const Network = (props) => {
	const [network, setNetwork] = useState({ interfaces: [], networkGatewayDefault: "", networkStats: {tx_sec: 0, rx_sec: 0} });
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
			setNetwork({ interfaces: filteredData, networkGatewayDefault: data.networkGatewayDefault, networkStats: data.networkStats[0] });
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
				<ModuleHeader isActive={props.isActive} delay={props.delay} title="NETWORK" subtitle={navigator.onLine ? publicIP : "OFFLINE"}/>
				<AnimatedPanel isActive={props.isActive} delay={props.delay}>
					<div className="row">
						{navigator.onLine &&
							<div className="col" style={{ alignItems: 'flex-start', flexBasis: "100%" }}>
								<span className="display text-tiny text-secondary">UP<span>-{Math.round(network.networkStats.tx_sec / Math.pow(1024, ((network.networkStats.tx_sec >= 1024 * 1024 ? 2 : 1))))} {(network.networkStats.tx_sec >= 1024 * 1024 ? "MB" : "KB")}</span></span>
								<ProgressBar vertical progress={(network.networkStats.tx_sec / (network.networkStats.tx_sec + network.networkStats.rx_sec)) * 100} />
							</div>
						}
						{navigator.onLine &&
							<div className="col" style={{ alignItems: 'flex-start', flexBasis: "100%" }}>
								<span className="display text-tiny text-secondary">DOWN<span>-{Math.round(network.networkStats.rx_sec / Math.pow(1024, ((network.networkStats.rx_sec >= 1024 * 1024 ? 2 : 1))))} {(network.networkStats.rx_sec >= 1024 * 1024 ? "MB" : "KB")}</span></span>
								<ProgressBar vertical progress={(network.networkStats.rx_sec / (network.networkStats.tx_sec + network.networkStats.rx_sec)) * 100} />
							</div>
						}
						{navigator.onLine &&
							<div className="col" style={{ alignItems: 'flex-end', flexBasis: "100%" }}>
									<span className="display text-tiny text-secondary">PING</span>
									<span className="display text-medium text-primary">{ping}ms</span>
							</div>
						}
					</div>
					<ListContainer title="INTERFACES">
						{network.interfaces.map((item, index) => {
							return (
								<ListItem key={index} name1={item.ifaceName} value1={item.mac ? item.mac : item.ip6} name2={item.ip4} value2={item.type}></ListItem>
							)
						})}
					</ListContainer>
					<Spacer type={"top"} />
				</AnimatedPanel>
			</div>
		)
	}

	return getNetwork()
}

export default Network