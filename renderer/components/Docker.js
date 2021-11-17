import { useState, useEffect } from "react";
import Spacer from "./Spacer";

import {useTransition, animated} from 'react-spring'

import introAudioFile from '../assets/audio/panels.mp3'
import exitAudioFile from '../assets/audio/scanFast.mp3'
import Circle from "./Circle";
import { getDisplayName } from "next/dist/shared/lib/utils";

const Docker = (props) => {
	const introAudio = new Audio(introAudioFile);
	const exitAudio = new Audio(exitAudioFile);
	const [docker, setDocker] = useState(null);
	const transition = useTransition(props.isActive, {
		from: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		enter: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
		leave: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		delay: props.delay,
		config: { mass: 1, tension: 500, friction: 18 }
	});


  useEffect(() => {
	  setDockerStats()
	const interval = setInterval(() => {
		setDockerStats()
	}, 3000);
	return () => clearInterval(interval);
  }, []);

  const setDockerStats = () => {
	  const dockerStats = window.electron.system.docker().then((data) => {
		  if (data.dockerInfo.containers === undefined) {
			  setDocker(null)
		  } else {
			  setDocker({ ...data.dockerInfo, systemMemTotal: data.mem.total, containerInfo: [...data.dockerContainers] })
		  }
	  })
  }

  useEffect(() => {
	  setTimeout(() => {
		  if (props.isActive) {
			  introAudio.currentTime = 0
			  introAudio.volume = 1
			  introAudio.play();
		  } else {
			  exitAudio.currentTime = 0
			  exitAudio.volume = 0.5
			  exitAudio.play();
		  }
	  }, props.delay);
  }, [props.isActive])

  const getDocker = () => {
		return (
			<div>
			{docker && 
				<div>
					<span className="display" style={{ margin: 5 }}>DOCKER <span className="display text-small text-secondary"> - {docker.images} IMAGES</span></span>
					<Spacer type={"bottom"} />
					<div className="row">
						<div className="col">
							<Circle progress={Math.round((docker.containersRunning / docker.containers) * 100)} info={docker.containersRunning+" running"} />
						</div>
						<div className="col">
							<Circle progress={Math.round((docker.containersPaused / docker.containers) * 100)} info={docker.containersPaused + " paused"} />
						</div>
						<div className="col">
							<Circle progress={Math.round((docker.memTotal / docker.systemMemTotal) * 100)} info={"memory usage"} />
						</div>
					</div>
					{docker.containerInfo.length > 0 && <Spacer type={"vertical"} />}
					{Object.keys(docker.containerInfo).map((key, index) => {
						return (
							<div key={index} className="row">
								<div className="col">
									<span className="display text-small text-secondary">{docker.containerInfo[key].state.toUpperCase()}</span>
									<span className="display text-small">{docker.containerInfo[key].name}</span>
									<span className="display text-tiny text-secondary">ID - {docker.containerInfo[key].id.substring(0, 6)}</span>
								</div>
							</div>
						)
					})}
					<Spacer type={"top"} />
				</div>
			}
			{!docker &&
				<div>
					<span className="display" style={{ margin: 5 }}>DOCKER <span className="display text-small text-secondary">OFFLINE</span></span>
					<Spacer type={"top"} />
				</div>
			}
			</div>
		)
  }

	return transition(
		(styles, item) => item && <animated.div style={styles}>{getDocker()}</animated.div>
	)
}

export default Docker