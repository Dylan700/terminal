import style from '../assets/styles/modal.module.sass'
import Spacer from './Spacer'
import useSettings from '../contexts/settings'
import { useEffect, useState } from 'react'

import audioFile from '../assets/audio/info.mp3'

const Settings = (props) => {

	const audio = new Audio(audioFile);
	const { currentSettings, setCurrentSettings } = useSettings()
	const [active, setActive] = useState(false)

	useEffect(() => {
		const handleKeyDown = (e) => {
			if(e.keyCode === 188 && e.metaKey){
				setActive(prev => !prev)
				if(currentSettings.enableAudio){
					audio.currentTime = 0
					audio.volume = 0.3
					audio.play()
				}
			}
		}
		window.addEventListener("keydown", handleKeyDown)
		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [currentSettings.enableAudio])

	return (
		<div className={style.modal} style={{display: active ? "inherit" : "none"}}>
			<div className="row">
				<span className="display text-large" style={{ margin: 5 }}>SETTINGS</span>
			</div>
			<Spacer type={"vertical"} />
			<div className="row">
				<div className="col">
					<span className="display" style={{ margin: 5 }}>AUDIO</span>
					<Spacer type={"top"} />
				</div>
				<div className="col">
					<div className="row">
						<div className="col">
							<span className="display text-small">Enable Audio</span>
						</div>
						<div className="col">
							<input type="checkbox" checked={currentSettings.enableAudio} onChange={() => setCurrentSettings(prev => {return { ...prev, enableAudio: !currentSettings.enableAudio}})}/>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<span className="display text-small">Enable Intro Music</span>
						</div>
						<div className="col">
							<input type="checkbox" checked={currentSettings.enableIntroMusic} onChange={() => setCurrentSettings(prev => { return { ...prev, enableIntroMusic: !currentSettings.enableIntroMusic } })} />
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<span className="display" style={{ margin: 5 }}>GITHUB</span>
					<Spacer type={"top"} />
				</div>
				<div className="col">
					<div className="row">
						<div className="col">
							<span className="display text-small">Username</span>
						</div>
						<div className="col">
							<input type="text" placeholder={currentSettings.githubUsername} onChange={(e) => setCurrentSettings(prev => { return { ...prev, githubUsername: e.target.value } })} />
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<span className="display" style={{ margin: 5 }}>CALENDAR</span>
					<Spacer type={"top"} />
				</div>
				<div className="col">
					<div className="row">
						<div className="col">
							<span className="display text-small">ICAL URL</span>
						</div>
						<div className="col">
							<input type="text" placeholder={currentSettings.icalUrl} onChange={(e) => setCurrentSettings(prev => { return { ...prev, icalUrl: e.target.value } })} />
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<span className="display" style={{ margin: 5 }}>THEMES</span>
					<Spacer type={"top"} />
				</div>
			</div>
		</div>
	)
}

export default Settings