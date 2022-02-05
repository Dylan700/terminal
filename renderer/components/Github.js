import { useState, useEffect } from "react";
import Spacer from "./Spacer";
import axios from "axios";
import { FaGithub } from "react-icons/fa";
import useTheme from "../contexts/theme";

const Performance = (props) => {
	const [github, setGithub] = useState(null);
	const {currentTheme} = useTheme();

  useEffect(() => {
	  const interval = setInterval(() => {
		  setGithubData()
	  }, 10000);
	  return () => clearInterval(interval);
  }, []);

	const setGithubData = () => {
		// send request with axios to github api
		axios.get("https://api.github.com/users/Dylan700").then((res) => {
			setGithub(res.data);
			console.log(res.data);
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