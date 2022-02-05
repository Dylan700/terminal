import { useState, useEffect } from "react";
import Spacer from "./Spacer";
import axios from "axios";
import { FaGithub } from "react-icons/fa";
import useTheme from "../contexts/theme";

const Performance = ({username}) => {
	const [github, setGithub] = useState(null);
	const {currentTheme} = useTheme();
	const [timer, setTimer] = useState(null);

	useEffect(() => {
		if(timer != null){
			clearInterval(timer);
		}
		setTimer(setInterval(() => {
			setGithubData(username)
		}, 5000))
		
		return () => {
			if(timer != null){
				clearInterval(timer);
			}
		}
	}, [username])

	const setGithubData = (username) => {
		axios.get(`https://api.github.com/users/${username}`).then((res) => {
			setGithub(res.data);
		}).catch(e => {setGithub(null)});
  	}

	const getPerformance = () => {
		if(github != null){
			return (
				<div>
					<Spacer type="bottom" />
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
					<Spacer type={"top"} />
				</div>
			)
		}else{
			return(
				<div>
					<span className="display" style={{ margin: 5 }}>GITHUB <span className="display text-small text-secondary">OFFLINE</span></span>
					<Spacer type={"top"} />
				</div>
			)
		}
	}
		

	return getPerformance()
}

export default Performance