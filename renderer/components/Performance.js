import { useState, useEffect } from "react";
import Spacer from "./Spacer";

import {useTransition, animated} from 'react-spring'

import introAudioFile from '../assets/audio/panels.mp3'
import exitAudioFile from '../assets/audio/scanFast.mp3'
import Circle from "./Circle";

const Performance = (props) => {
	const introAudio = new Audio(introAudioFile);
	const exitAudio = new Audio(exitAudioFile);
	const [performance, setPerformance] = useState({ currentLoad: { currentLoad: "0"}, mem: {total: 0, used: 0}, fsStats: "tx_sec"});
	const transition = useTransition(props.isActive, {
		from: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		enter: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
		leave: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
		delay: props.delay,
		config: { mass: 1, tension: 500, friction: 18 }
	});


  useEffect(() => {
	  //set performance stats every 2 seconds
	  const interval = setInterval(() => {
		  setPerformanceStats()
	  }, 2000);
	  return () => clearInterval(interval);
  }, []);

  const setPerformanceStats = () => {
	  const performanceStats = window.electron.system.performance().then((data) => {
		  setPerformance({
			  currentLoad: data.currentLoad,
			  mem: data.mem,
			  fsStats: data.fsStats
		  })
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

	const getPerformance = () => {
	  return (
		  <div>
			  <div className="row">
				  <div className="col">
					  <Circle progress={Math.round(performance.currentLoad.currentLoad)} info={"CPU"} />
				  </div>
				  <div className="col">
					  <Circle progress={Math.round((performance.mem.used / performance.mem.total) * 100)} info={"MEMORY"} />
				  </div>
			  </div>
			  <Spacer type={"top"} />
		  </div>
	  )
  }

	return transition(
		(styles, item) => item && <animated.div style={styles}>{getPerformance()}</animated.div>
	)
}

export default Performance