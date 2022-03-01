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

	const findModule = (type, isActive) => {
		if (type === "terminal") {
			return <Terminal isActive={isActive} />
		} else if (type === "datetime") {
			return <DateTime isActive={isActive} />
		} else if (type === "hardware") {
			return <Hardware isActive={isActive} />
		} else if (type === "network") {
			return <Network isActive={isActive} />
		} else if (type === "performance") {
			return <Performance isActive={isActive} />
		} else if (type === "docker") {
			return <Docker isActive={isActive} />
		} else if (type === "spotify") {
			return <Spotify isActive={isActive} />
		} else if (type === "github") {
			return <Github isActive={isActive} />
		} else if (type === "calendar") {
			return <Calendar isActive={isActive} />
		}
	}

	const getModules = (isActive) => {
		if(config == null || config.modules == null){
			return;
		}

		return config.modules.map((module, index) => {

			return (
				<div key={index} className={styles.item} style={{gridArea: `${module.startRow}/${module.startCol}/${module.endRow}/${module.endCol}`}}>
					{findModule(module.type, isActive)}
				</div>
			)
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
				console.log(f.path);
				setConfig(await window.electron.file.json(f.path));
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