import { useState, useEffect } from "react";
import Spacer from "./Spacer";
import useTheme from "../contexts/theme";
import ICAL from "ical.js";

const Calendar = (props) => {
	const [data, setData] = useState();

	useEffect(() => {
		// get calendar data then save the parsed ICAL object
		// need to fix cors stuff with axios https://pratikpc.medium.com/bypassing-cors-with-electron-ab7eaf331605
		const rawData = `
BEGIN:VCALENDAR
PRODID:-//Allocate//iCal4j 1.0//EN
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTAMP:20220205T011823Z
DTSTART;TZID=Australia/Sydney:20220221T100000
DTEND;TZID=Australia/Sydney:20220221T120000
SUMMARY:Introduction to Artificial Intelligence\, LEC
LOCATION:-
DESCRIPTION:COMP3308-S1C-ND-RE\, LEC\, 01 Introduction to Artificial Intelligence Staff: - Location: -
END:VEVENT
UID:uid0
END:VCALENDAR
`;
		const icalDataParse = ICAL.parse(rawData);
		const icalData = new ICAL.Component(icalDataParse);
		setData(icalData);
	}, []);

	// get the events from the ical where the date matches the current day/year
	const getEvents = (date, data) => {
		if (data) {
			const events = data.getAllSubcomponents("vevent");
			const filteredEvents = events.filter((e) => {
				const event = new ICAL.Event(e);
				return (
					event.startDate.year === date.getFullYear() &&
					event.startDate.day === date.getDate() && event.startDate.month-1 === date.getMonth()
				);
			});
			return filteredEvents;
		}else{
			return [];
		}
	}


	
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
	const getEventDiv = (duration, startTime, summary) => {
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
				<marquee scrollamount={2} className="display text-tiny" style={{color: "var(--background-color)"}}>{summary}</marquee>
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
						{getEvents(new Date(2022, 1, 21, 0, 0, 0, 0), data).map((event) => {
							const e = new ICAL.Event(event);
							return getEventDiv(e.duration.hours*60, e.startDate.minute + e.startDate.hour * 60, e.summary);
						})}
						{getEventDiv(60, 60 * 14)}
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