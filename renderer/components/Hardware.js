import { useState, useEffect } from "react";
import Spacer from "../components/Spacer";

const Hardware = () => {
	  const [hardware, setHardware] = useState({manufacturer: '', model: '', version: '', serial: ''});

  useEffect(() => {
	const hardwareStats = window.electron.system.hardware().then((data) => {
		setHardware({
			manufacturer: data.manufacturer,
			model: data.model,
			version: data.version,
			serial: data.serial
		});
	});
  }, []);

  return (
	<div>
		<div className="row">
			<div className="col">
				<span className="display text-small text-secondary">MANUFACTURER</span>
				<span className="display text-small">{hardware.manufacturer}</span>
			</div>
			<div className="col">
				<span className="display text-small text-secondary">MODEL</span>
				<span className="display text-small">{hardware.model}</span>
			</div>
		</div>
		<Spacer type={"top"} />
	</div>
  )
}

export default Hardware