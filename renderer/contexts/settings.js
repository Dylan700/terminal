import { useContext, useState, createContext } from 'react'


// this is a default settings object
const defaultSettings = {
	enableAudio: true,
	backgroundOpacity: 1,
	backgroundBlurEnabled: true,
}

const SettingsContext = createContext(defaultSettings)

export const SettingsProvider = ({ settings, children }) => {

	const [currentSettings, setCurrentSettings] = useState(settings || defaultSettings)
	const setSettings = (settings) => {
		setCurrentSettings(settings)
		if (window != null) {
			window.localStorage.setItem('settings', settings)
		}
	}

	return (
		<SettingsContext.Provider value={{ currentSettings, setSettings }}>
			{children}
		</SettingsContext.Provider>
	)
}

const useSettings = () => useContext(SettingsContext)

export default useSettings

