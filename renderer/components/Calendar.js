import { useState, useEffect } from "react";
import Spacer from "./Spacer";
import axios from "axios";
import useTheme from "../contexts/theme";
import ProgressBar from "./ProgressBar";

const Calendar = (props) => {
	// ical = https://timetable.sydney.edu.au/even/rest/calendar/ical/cea653ea-91a2-4850-a718-297f621ada00
	
	// return the date as a percentage between 12am to 12am (24 hours), so 0.5 would be 12pm
	const dateAsPercentage = (date) => {
		const now = new Date();
		const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
		const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
		const diff = end - start;
		const diffDate = date - start;
		return diffDate / diff;
	}

	// return a div with the given percentage width based on the duration in minutes, and left margin offset based on the time. For example a 30 min event would be 1/48th of the width
	const getEventDiv = (duration, startTime) => {
		const percentage = duration / 60 / 24;
		const left = startTime / 60 / 24;
		return (
			<div
				style={{
					position: "absolute",
					width: `${percentage * 100}%`,
					marginLeft: `${left * 100}%`,
					backgroundColor: "var(--primary-color)",
				}}
			>
				<marquee scrollamount={2} className="display text-tiny" style={{color: "var(--background-color)"}}>Event Here</marquee>
			</div>
		);
	}

	const getCalendar = () => {
		return (
			<div>
				<Spacer type="bottom" />


				<div className="container" style={{margin: "10px"}}>
					<div style={{ width: "100%" }}>
						<div className="text-primary" style={{ marginLeft: `${dateAsPercentage(new Date()) * 100}%`, position: "absolute" }}>
							<div style={{ width: "2px", height: "30px", backgroundColor: "var(--primary-color)" }}></div>
						</div>
						<div className="row" style={{ alignItems: "center" }}>
							<div className="col">
								<span className="display text-secondary text-tiny">12am</span>
							</div>
							<div className="col" style={{ width: "100%" }}>
								<div style={{ border: "0.5px solid var(--secondary-color)" }}></div>
							</div>
							<div className="col">
								<span className="display text-secondary text-tiny">12pm</span>
							</div>
							<div className="col" style={{ width: "100%" }}>
								<div style={{ border: "0.5px solid var(--secondary-color)" }}></div>
							</div>
							<div className="col">
								<span className="display text-secondary text-tiny">12am</span>
							</div>
						</div>
					</div>

					<div className="col" style={{ width: "100%", position: "relative", height: "20px"}}>
						{/* 2pm event, going for 1 hour */}
						<span className={`display text-small ${new Date().getDay() == 0 ? "text-primary": "text-secondary" }`}>SUN</span>
						{getEventDiv(60, 60 * 14)}
						{getEventDiv(60, 60 * 6)}
					</div>
					<div className="col" style={{ width: "100%", position: "relative" , height: "20px"}}>
						{/* 2pm event, going for 1 hour */}
						<span className={`display text-small ${new Date().getDay() == 1 ? "text-primary" : "text-secondary"}`}>MON</span>
						{getEventDiv(60, 60 * 15)}
						{getEventDiv(60, 60 * 8)}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						{/* 2pm event, going for 1 hour */}
						<span className={`display text-small ${new Date().getDay() == 2 ? "text-primary" : "text-secondary"}`}>TUE</span>
						{getEventDiv(60, 60 * 14)}
						{getEventDiv(60, 60 * 6)}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						{/* 2pm event, going for 1 hour */}
						<span className={`display text-small ${new Date().getDay() == 3 ? "text-primary" : "text-secondary"}`}>WED</span>
						{getEventDiv(60, 60 * 15)}
						{getEventDiv(60, 60 * 8)}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						{/* 2pm event, going for 1 hour */}
						<span className={`display text-small ${new Date().getDay() == 4 ? "text-primary" : "text-secondary"}`}>THU</span>
						{getEventDiv(60, 60 * 14)}
						{getEventDiv(60, 60 * 6)}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						{/* 2pm event, going for 1 hour */}
						<span className={`display text-small ${new Date().getDay() == 5 ? "text-primary" : "text-secondary"}`}>FRI</span>
						{getEventDiv(60, 60 * 15)}
						{getEventDiv(60, 60 * 8)}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						{/* 2pm event, going for 1 hour */}
						<span className={`display text-small ${new Date().getDay() == 6 ? "text-primary" : "text-secondary"}`}>SAT</span>
						{getEventDiv(60, 60 * 15)}
						{getEventDiv(60, 60 * 8)}
					</div>

				</div>
				<Spacer type={"top"} />
			</div>
		)
	}

	return getCalendar()
}

export default Calendar