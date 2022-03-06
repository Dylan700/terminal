import { useContext, useState, createContext, useEffect } from 'react'

import defaultTheme from '../assets/themes/default.json'


// this is a default settings object
const defaultSettings = {
	enableAudio: true,
	enableIntroMusic: true,
	githubUsername: null,
	icalUrl: null,
	backgroundOpacity: 1,
	backgroundBlurEnabled: true,
	alertWhenBatteryFull: true,
	themes: [
		defaultTheme
	]
}

const SettingsContext = createContext(defaultSettings)

export const SettingsProvider = ({ settings, children }) => {

	const [currentSettings, setCurrentSettings] = useState(settings || defaultSettings)

	useEffect(() => {
		setCurrentSettings(localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : defaultSettings)
	}, [])

	useEffect(() => {
		localStorage.setItem('settings', JSON.stringify(currentSettings))
	}, [currentSettings])

	return (
		<SettingsContext.Provider value={{ currentSettings, setCurrentSettings }}>
			{children}
		</SettingsContext.Provider>
	)
}

const useSettings = () => useContext(SettingsContext)

export default useSettings

