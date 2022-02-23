import { useState, useEffect } from "react";
import Spacer from "../components/Spacer";
import AnimatedText from "./AnimatedText";
import {ListContainer, ListItem} from "./List";
import ModuleHeader from "./ModuleHeader";

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
				<ModuleHeader isActive={props.isActive} title="NETWORK" subtitle={navigator.onLine ? publicIP : "OFFLINE"}/>
				<div className="row">
					{navigator.onLine &&
						<div className="col" style={{ alignItems: 'flex-end' }}>
							<span className="display text-tiny text-secondary">UP/DOWN</span>
							<span className="display text-medium text-primary">10%</span>
						</div>
					}
					{navigator.onLine &&
						<div className="col" style={{ alignItems: 'flex-end' }}>
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
			</div>
		)
	}

	return getNetwork()
}

export default Network