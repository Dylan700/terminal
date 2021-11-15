import { useEffect, useState } from "react";
import Spacer from "./Spacer";

const DateTime = () => {
	const [datetime, setDateTime] = useState(new Date())
	const startDate = new Date()
	const [uptime, setUptime] = useState(0)

	const formatTime = (time) => {
		const hours = time.getHours();
		const minutes = time.getMinutes();
		const seconds = time.getSeconds();
		return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}

	const formatUptime = (time) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = Math.floor(time % 60);
		return `${hours < 10 ? `${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}

	const formatDate = (date) => {
		const month = date.toLocaleString("default", { month: "short" });
		const day = date.getDate();
		return `${month} ${day}`;
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setDateTime(new Date())
			setUptime(window.electron.system.uptime())
		}, 1000)
		return () => clearInterval(interval)
	}, [datetime])

	return (
		<div>
			<div className="row">
				<span className="display text-large">{formatTime(datetime)}</span>
			</div>
			<Spacer type={"bottom"} />
			<div className="row">
				<div className="col">
					<span className="display text-small text-secondary">{datetime.getFullYear()}</span>
					<span className="display text-small">{formatDate(datetime)}</span>
				</div>
				<div className="col width-80">
					<span className="display text-small text-secondary">{"UPTIME"}</span>
					<span className="display text-small">{formatUptime(uptime)}</span>
				</div>
				<div className="col width-80">
					<span className="display text-small text-secondary">{"OS"}</span>
					<span className="display text-small">{"LINUX"}</span>
				</div>
				<div className="col width-80">
					<span className="display text-small text-secondary">{"POWER"}</span>
					<span className="display text-small">{"ON"}</span>
				</div>
			</div>
			<Spacer type={"top"} />
		</div>
	)
}

export default DateTime;