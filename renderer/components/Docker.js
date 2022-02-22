import { useState, useEffect } from "react";
import Spacer from "./Spacer";

import Circle from "./Circle";
import ModuleHeader from "./ModuleHeader";
import AnimatedPanel from "./AnimatedPanel";

const Docker = (props) => {
	const [docker, setDocker] = useState(null);


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

  const getDocker = () => {
		return (
			<div>

				<ModuleHeader isActive={props.isActive} title="DOCKER" subtitle={docker ? `${docker.images} IMAGES` : "OFFLINE"}/>
				<AnimatedPanel isActive={props.isActive}>
					{docker && 
						<div>
							<div className="row">
								<div className="col">
									<Circle progress={Math.round((docker.containersRunning / docker.containers) * 100)} info={docker.containersRunning + " running"} />
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
						</div>
					}
				</AnimatedPanel>
			</div>
		)
  }

	return getDocker()
}

export default Docker