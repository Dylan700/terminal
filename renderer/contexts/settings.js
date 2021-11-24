import { useContext, useState, createContext, useEffect } from 'react'


// this is a default settings object
const defaultSettings = {
	enableAudio: true,
	backgroundOpacity: 1,
	backgroundBlurEnabled: true,
	alertWhenBatteryFull: true,
}

const SettingsContext = createContext(defaultSettings)

export const SettingsProvider = ({ settings, children }) => {

	const [currentSettings, setCurrentSettings] = useState(settings || defaultSettings)
	const setSettings = (settings) => {
		setCurrentSettings({...currentSettings, settings})
	}

	return (
		<SettingsContext.Provider value={{ currentSettings, setSettings }}>
			{children}
		</SettingsContext.Provider>
	)
}

const useSettings = () => useContext(SettingsContext)

export default useSettings

