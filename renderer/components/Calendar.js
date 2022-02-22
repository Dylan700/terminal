import { useState, useEffect } from "react";
import Spacer from "./Spacer";
import ICAL from "ical.js";
import useSettings from "../contexts/settings";
import Tooltip from "./Tooltip";
import AnimatedPanel from "./AnimatedPanel";

// TODO: add ical data to localstorage to save between sessions if user is offline
const Calendar = (props) => {
	const [data, setData] = useState();
	const {currentSettings} = useSettings();

	useEffect(async () => {
		// set ical to lenient mode to prevent time parsing errors
		ICAL.design.strict = false;
		const defaultData = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Google Inc//Google Calendar 70.9054//EN\nCALSCALE:GREGORIAN\nBEGIN:VTIMEZONE\nTZID:Australia/Sydney\nBEGIN:STANDARD\nTZOFFSETFROM:+1100\nTZOFFSETTO:+1000\nTZNAME:EST\nDTSTART:19700101T000000\nEND:STANDARD\nEND:VTIMEZONE\nEND:VCALENDAR";

		let rawData = await window.electron.net.ical(currentSettings.icalUrl);

		if (rawData == null) {
			rawData = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Google Inc//Google Calendar 70.9054//EN\nCALSCALE:GREGORIAN\nBEGIN:VTIMEZONE\nTZID:Australia/Sydney\nBEGIN:STANDARD\nTZOFFSETFROM:+1100\nTZOFFSETTO:+1000\nTZNAME:EST\nDTSTART:19700101T000000\nEND:STANDARD\nEND:VTIMEZONE\nEND:VCALENDAR";
		}

		let icalDataParse;

		try {
			icalDataParse = ICAL.parse(rawData);
		} catch (e) {
			icalDataParse = ICAL.parse(defaultData);
		}
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
					event.startDate.day === date.getDate() && event.startDate.month - 1 === date.getMonth()
				);
			});
			return filteredEvents;
		} else {
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
					minHeight: "1em", 
					bottom: 0
				}}
			>
					<marquee scrollamount={2} className="display text-tiny" style={{ color: "var(--background-color)" }}>{summary}</marquee>
			</div>
		);
	}

	// given a day "SUN", "MON" etc., return the date of the next occurence of that day. So if the day is Tuesday, but it is currently Thursday, return the date of the next Tuesday
	const getNextDate = (day) => {
		const today = new Date();
		const dayIndex = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].indexOf(day);
		let nextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (dayIndex - today.getDay()));
		if(nextDay.getDate() < today.getDate()) {
			nextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (dayIndex - today.getDay() + 7));
		}
		return nextDay;
	}

	const getCalendar = () => {
		return (
			<AnimatedPanel isActive={props.isActive}>
				<Spacer type="bottom" />

				<div className="container" style={{ margin: "10px", position: "relative" }}>
					<div style={{ width: "100%" }}>
						<div className="text-primary" style={{ marginLeft: `${dateAsPercentage(new Date()) * 100}%`, position: "absolute" }}>
							<div style={{ width: "3px", height: "30px", backgroundColor: "var(--primary-color)" }}></div>
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

					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						<span className={`display text-small ${new Date().getDay() == 0 ? "text-primary" : "text-secondary"}`}>SUN</span>
						{getEvents(getNextDate("SUN"), data).map((event) => {
							const e = new ICAL.Event(event);
							const duration = `${e.startDate.hour < 12 ? e.startDate.hour : e.startDate.hour - 12}:${e.startDate.minute < 10 ? "0" + e.startDate.minute : e.startDate.minute}${e.startDate.hour < 12 ? "am" : "pm"} - ${e.endDate.hour <= 12 ? e.endDate.hour : e.endDate.hour - 12}:${e.endDate.minute < 10 ? "0" + e.endDate.minute : e.endDate.minute}${e.endDate.hour < 12 ? "am" : "pm"}`;
							return (
								<Tooltip key={e.uid} title={e.summary} subtitle={duration} description={e.description}>
									{getEventDiv(e.duration.hours * 60, e.startDate.minute + e.startDate.hour * 60, e.summary)}
								</Tooltip>
							)
						})}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						<span className={`display text-small ${new Date().getDay() == 1 ? "text-primary" : "text-secondary"}`}>MON</span>
						{getEvents(getNextDate("MON"), data).map((event) => {
							const e = new ICAL.Event(event);
							const duration = `${e.startDate.hour < 12 ? e.startDate.hour : e.startDate.hour - 12}:${e.startDate.minute < 10 ? "0" + e.startDate.minute : e.startDate.minute}${e.startDate.hour < 12 ? "am" : "pm"} - ${e.endDate.hour <= 12 ? e.endDate.hour : e.endDate.hour - 12}:${e.endDate.minute < 10 ? "0" + e.endDate.minute : e.endDate.minute}${e.endDate.hour < 12 ? "am" : "pm"}`;
							return (
								<Tooltip key={e.uid} title={e.summary} subtitle={duration} description={e.description}>
									{getEventDiv(e.duration.hours * 60, e.startDate.minute + e.startDate.hour * 60, e.summary)}
								</Tooltip>
							)
						})}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						<span className={`display text-small ${new Date().getDay() == 2 ? "text-primary" : "text-secondary"}`}>TUE</span>
						{getEvents(getNextDate("TUE"), data).map((event) => {
							const e = new ICAL.Event(event);
							const duration = `${e.startDate.hour < 12 ? e.startDate.hour : e.startDate.hour - 12}:${e.startDate.minute < 10 ? "0" + e.startDate.minute : e.startDate.minute}${e.startDate.hour < 12 ? "am" : "pm"} - ${e.endDate.hour <= 12 ? e.endDate.hour : e.endDate.hour - 12}:${e.endDate.minute < 10 ? "0" + e.endDate.minute : e.endDate.minute}${e.endDate.hour < 12 ? "am" : "pm"}`;
							return (
								<Tooltip key={e.uid} title={e.summary} subtitle={duration} description={e.description}>
									{getEventDiv(e.duration.hours * 60, e.startDate.minute + e.startDate.hour * 60, e.summary)}
								</Tooltip>
							)
						})}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						<span className={`display text-small ${new Date().getDay() == 3 ? "text-primary" : "text-secondary"}`}>WED</span>
						{getEvents(getNextDate("WED"), data).map((event) => {
							const e = new ICAL.Event(event);
							const duration = `${e.startDate.hour < 12 ? e.startDate.hour : e.startDate.hour - 12}:${e.startDate.minute < 10 ? "0" + e.startDate.minute : e.startDate.minute}${e.startDate.hour < 12 ? "am" : "pm"} - ${e.endDate.hour <= 12 ? e.endDate.hour : e.endDate.hour - 12}:${e.endDate.minute < 10 ? "0" + e.endDate.minute : e.endDate.minute}${e.endDate.hour < 12 ? "am" : "pm"}`;
							return (
								<Tooltip key={e.uid} title={e.summary} subtitle={duration} description={e.description}>
									{getEventDiv(e.duration.hours * 60, e.startDate.minute + e.startDate.hour * 60, e.summary)}
								</Tooltip>
							)
						})}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						<span className={`display text-small ${new Date().getDay() == 4 ? "text-primary" : "text-secondary"}`}>THU</span>
						{getEvents(getNextDate("THU"), data).map((event) => {
							const e = new ICAL.Event(event);
							const duration = `${e.startDate.hour < 12 ? e.startDate.hour : e.startDate.hour - 12}:${e.startDate.minute < 10 ? "0" + e.startDate.minute : e.startDate.minute}${e.startDate.hour < 12 ? "am" : "pm"} - ${e.endDate.hour <= 12 ? e.endDate.hour : e.endDate.hour - 12}:${e.endDate.minute < 10 ? "0" + e.endDate.minute : e.endDate.minute}${e.endDate.hour < 12 ? "am" : "pm"}`;
							return (
								<Tooltip key={e.uid} title={e.summary} subtitle={duration} description={e.description}>
									{getEventDiv(e.duration.hours * 60, e.startDate.minute + e.startDate.hour * 60, e.summary)}
								</Tooltip>
							)
						})}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						<span className={`display text-small ${new Date().getDay() == 5 ? "text-primary" : "text-secondary"}`}>FRI</span>
						{getEvents(getNextDate("FRI"), data).map((event) => {
							const e = new ICAL.Event(event);
							const duration = `${e.startDate.hour < 12 ? e.startDate.hour : e.startDate.hour - 12}:${e.startDate.minute < 10 ? "0" + e.startDate.minute : e.startDate.minute}${e.startDate.hour < 12 ? "am" : "pm"} - ${e.endDate.hour <= 12 ? e.endDate.hour : e.endDate.hour - 12}:${e.endDate.minute < 10 ? "0" + e.endDate.minute : e.endDate.minute}${e.endDate.hour < 12 ? "am" : "pm"}`;
							return (
								<Tooltip key={e.uid} title={e.summary} subtitle={duration} description={e.description}>
									{getEventDiv(e.duration.hours * 60, e.startDate.minute + e.startDate.hour * 60, e.summary)}
								</Tooltip>
							)
						})}
					</div>
					<div className="col" style={{ width: "100%", position: "relative", height: "20px" }}>
						<span className={`display text-small ${new Date().getDay() == 6 ? "text-primary" : "text-secondary"}`}>SAT</span>
						{getEvents(getNextDate("SAT"), data).map((event) => {
							const e = new ICAL.Event(event);
							const duration = `${e.startDate.hour < 12 ? e.startDate.hour : e.startDate.hour - 12}:${e.startDate.minute < 10 ? "0" + e.startDate.minute : e.startDate.minute}${e.startDate.hour < 12 ? "am" : "pm"} - ${e.endDate.hour <= 12 ? e.endDate.hour : e.endDate.hour - 12}:${e.endDate.minute < 10 ? "0" + e.endDate.minute : e.endDate.minute}${e.endDate.hour < 12 ? "am" : "pm"}`;
							return (
								<Tooltip key={e.uid} title={e.summary} subtitle={duration} description={e.description}>
									{getEventDiv(e.duration.hours * 60, e.startDate.minute + e.startDate.hour * 60, e.summary)}
								</Tooltip>
							)
						})}
					</div>

				</div>
				<Spacer type={"top"} />
			</AnimatedPanel>
		)
	}

	return getCalendar()
}

export default Calendar