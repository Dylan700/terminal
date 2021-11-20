import { useState, useEffect } from "react";
import Spacer from "./Spacer";
import Circle from "./Circle";

const Performance = (props) => {
	const [performance, setPerformance] = useState({ currentLoad: { currentLoad: "0"}, mem: {total: 0, used: 0}, fsStats: "tx_sec"});

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

	return getPerformance()
}

export default Performance