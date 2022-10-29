import { useState, useEffect } from "react";
import Spacer from "./Spacer";
import Circle from "./Circle";
import ModuleHeader from "./ModuleHeader";
import AnimatedPanel from "./AnimatedPanel";

const Performance = (props) => {
	const [performance, setPerformance] = useState({ currentLoad: { currentLoad: "0" }, mem: { total: 0, used: 0 }, disk: "tIO_sec", processes: [], cpu: { manufacturer: "", model: "", cores: "", physicalCores: "" } });

  useEffect(() => {
	  //set performance stats every 2 seconds
	  const interval = setInterval(async () => {
		  setPerformanceStats()
	  }, 2000);
	  return () => clearInterval(interval);
  }, []);

  const setPerformanceStats = () => {
	  const performanceStats = window.electron.system.performance().then((data) => {
		  // filter processes by cpu percentage and get top 5.
		  const list = data.processes.list.sort((a, b) => b.cpu - a.cpu).splice(0, 5);
		  setPerformance({
			  currentLoad: data.currentLoad,
			  mem: data.mem,
			  disk: data.disksIO,
			  processes: list,
			  cpu: data.cpu
		  })
	  })
  }

	const getPerformance = () => {
	  return (
		  <div>
			  <ModuleHeader isActive={props.isActive} delay={props.delay} title="PERFORMANCE" subtitle={`${performance.cpu.manufacturer} - ${performance.cpu.model} | ${performance.cpu.physicalCores} Core`}/>
			  <AnimatedPanel isActive={props.isActive} delay={props.delay}>
				<div className="row">
					<div className="col">
						<Circle progress={Math.round(performance.currentLoad.currentLoad)} info={"CPU"} />
					</div>
					<div className="col">
						<Circle progress={Math.min(Math.round(performance.disk.tIO_sec), 100)} info={"DISK"} />
					</div>
					<div className="col">
						<Circle progress={Math.round((performance.mem.used / performance.mem.total) * 100)} info={"MEMORY"} />
					</div>
				</div>
				<Spacer type={"vertical"} />
				<div className="row">
					<span className="display text-small">TOP PROCESSES</span>
					<span className="display text-tiny text-secondary">PID</span>
					<span className="display text-tiny text-secondary">|</span>
					<span className="display text-tiny text-secondary">NAME</span>
					<span className="display text-tiny text-secondary">|</span>
					<span className="display text-tiny text-secondary">CPU</span>
					<span className="display text-tiny text-secondary">|</span>
					<span className="display text-tiny text-secondary">MEM</span>
				</div>
				<table style={{ width: "100%" }}>
				{performance.processes.map((p, i) => {
					return (
						<tr key={i}>
							<td><span className="display text-tiny text-secondary">{p.pid}</span></td>
							<td><span className="display text-tiny text-primary">{p.name}</span></td>
							<td><span className="display text-tiny text-secondary">{p.cpu}%</span></td>
							<td><span className="display text-tiny text-secondary">{p.mem}%</span></td>
						</tr>
					)
				})}
				</table>
				<Spacer type={"top"} />
			  </AnimatedPanel>
		  </div>
	  )
  }

	return getPerformance()
}

export default Performance