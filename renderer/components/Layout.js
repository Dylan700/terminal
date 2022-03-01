import styles from '../assets/styles/grid.module.sass';
import defaultConfig from "../assets/layouts/default.json";
import Grid from "../components/Grid";

import Terminal from "../components/AnimatedTerminal"
import DateTime from "../components/DateTime";
import Hardware from "../components/Hardware";
import Network from "../components/Network";
import Performance from "../components/Performance";
import Docker from "../components/Docker";
import Spotify from "../components/Spotify";
import Github from "../components/Github";
import Calendar from "../components/Calendar";

import { useState, useEffect } from 'react';

const Layout = (props) => {

	const [modules, setModules] = useState([]);
	const [config, setConfig] = useState(defaultConfig);

	const findModule = (type, isActive, delay) => {
		if (type === "terminal") {
			return <Terminal isActive={true} delay={delay}/>
		} else if (type === "datetime") {
			return <DateTime isActive={isActive} delay={delay}/>
		} else if (type === "hardware") {
			return <Hardware isActive={isActive} delay={delay}/>
		} else if (type === "network") {
			return <Network isActive={isActive} delay={delay}/>
		} else if (type === "performance") {
			return <Performance isActive={isActive} delay={delay}/>
		} else if (type === "docker") {
			return <Docker isActive={isActive} delay={delay}/>
		} else if (type === "spotify") {
			return <Spotify isActive={isActive} delay={delay}/>
		} else if (type === "github") {
			return <Github isActive={isActive} delay={delay}/>
		} else if (type === "calendar") {
			return <Calendar isActive={isActive} delay={delay}/>
		}
	}

	const getModules = (isActive) => {
		if(config == null || config.modules == null){
			return;
		}

		let delay = 0;
		return config.modules.map((module, index) => {
			delay += 170;
			console.log(delay)
			if(module.type === "terminal" && !isActive){
				return (
					<div key={index} className={styles.item} style={{ gridArea: "1/1/17/17" }}>
						{findModule(module.type, isActive, 0)}
					</div>
				)
			}else{
				return (
					<div key={index} className={styles.item} style={{gridArea: `${module.startRow}/${module.startCol}/${module.endRow}/${module.endCol}`}}>
						{findModule(module.type, isActive, delay)}
					</div>
				)
			}
		})
	}

	useEffect(() => {
		setModules(getModules(props.isFullscreen));
	}, [props.isFullscreen, config]);

	useEffect(() => {
		const dropListener = document.addEventListener('drop', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			for (let f of e.dataTransfer.files) {
				const data = await window.electron.file.json(f.path);
				if(data.modules){
					setConfig(data);
				}
			}
		});

		const dragOverListener = document.addEventListener('dragover', (e) => {
			e.preventDefault();
			e.stopPropagation();
		});

		return () => {
			document.removeEventListener('drop', dropListener);
			document.removeEventListener('dragover', dragOverListener);
		}
	}, [])

	return (
		<Grid>
			{modules}
		</Grid>
	)
}

export default Layout;