import { useEffect, useState } from "react";
import Spacer from "./Spacer";
import Circle from './Circle'
import useSettings from "../contexts/settings";

const DateTime = (props) => {
	const [datetime, setDateTime] = useState(new Date())
	const [uptime, setUptime] = useState(0)
	const [timezone, setTimezone] = useState("Determining Location...")
	const [os, setOs] = useState({platform: "", distro: "", release: "", codename: "", kernel: ""})
	const [battery, setBattery] = useState({ isCharging: false, percent: 0, timeRemaining: 0 })

	const {currentSettings} = useSettings()

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
			const timeStats = window.electron.system.time()
			setDateTime(new Date())
			setUptime(timeStats.uptime)
			setTimezone(timeStats.timezoneName)
		}, 1000)

		const batteryStats = window.electron.system.battery().then(stats => {
			setBattery({
				isCharging: stats.isCharging,
				percent: stats.percent,
				timeRemaining: stats.timeRemaining
			})
		})

		return () => clearInterval(interval)
	}, [datetime])

	useEffect(() => {
		if (currentSettings.alertWhenBatteryFull && battery.percent === 100 && !window.electron.system.doNotDisturb()) {
			new Notification("Battery is Full", {body: "You should unplug the charger now."})
		}
	}, [battery.percent])

	useEffect(() => {
		const osStats = window.electron.system.os((data) => {
			setOs({
				platform: data.platform,
				distro: data.distro,
				release: data.release,
				codename: data.codename,
				kernel: data.kernel
			})
		})
	}, [])

	const getDateTime = () => {
		return (
			<div>
				<div className="row align-center">
					<div className="col">
						<span className="display text-large">{formatTime(datetime)}</span>
						<span className="display text-tiny text-secondary">{timezone}</span>
					</div>
					<div className="col align-center">
						<Circle progress={battery.percent} info={!battery.isCharging ? `${battery.timeRemaining} ${battery.timeRemaining === 1 ? "minute" : "minutes"}` : "CHARGING"} />
					</div>
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
					<div className="col">
						<span className="display text-small text-secondary">OS</span>
						<span className="display text-small">{os.codename} <span className="text-tiny text-secondary">{os.release}</span></span>
					</div>
				</div>
				<Spacer type={"vertical"} />
			</div>
		)
	}

	return (
		getDateTime()
	)
}

export default DateTime;