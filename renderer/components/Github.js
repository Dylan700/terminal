import { useState, useEffect } from "react";
import Spacer from "./Spacer";
import axios from "axios";
import { FaGithub } from "react-icons/fa";
import useTheme from "../contexts/theme";
import ModuleHeader from "./ModuleHeader";
import AnimatedPanel from "./AnimatedPanel";
import useSettings from "../contexts/settings";

const Github = (props) => {
	const [github, setGithub] = useState(null);
	const {currentTheme} = useTheme();
	const {currentSettings, setCurrentSettings} = useSettings();

	useEffect(() => {
		setGithubData(currentSettings.githubUsername)
	}, [currentSettings.githubUsername])

	const setGithubData = (username) => {
		axios.get(`https://api.github.com/users/${username}`).then((res) => {
			setGithub(res.data);
		}).catch(e => {setGithub(null)});
  	}

	const getGithub = () => {
		return (
			<div>
				<ModuleHeader isActive={props.isActive} title="GITHUB" subtitle={github != null ? "ONLINE" : "OFFLINE"} id ="GH"/>
				<AnimatedPanel isActive={props.isActive} delay={500}>
					{github != null &&
						<div className="row" style={{ alignItems: 'center' }}>
									<div className="col">
										<div className="row" style={{ alignItems: 'center' }}>
											<div className="col">
												<div className="image-circle" style={{ backgroundImage: `url(${github.avatar_url}` }}></div>
											</div>
											<div className="col">
												<span className="display text-small">{github.login}</span>
											</div>
										</div>
									</div>
									<div className="col">
										<FaGithub style={{ marginRight: 10 }} size={30} color={currentTheme.primaryColor} />
									</div>
								</div>
					}
				</AnimatedPanel>
			</div>
		);
	}
		

	return getGithub()
}

export default Github