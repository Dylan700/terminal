import { useContext, useState, createContext, useEffect } from 'react'
import useSettings from './settings'
import defaultTheme from '../assets/themes/default.json'


const ThemeContext = createContext(defaultTheme)

export const ThemeProvider = ({theme, children}) => {

	const [currentTheme, setCurrentTheme] = useState(defaultTheme)
	const {currentSettings, setCurrentSettings} = useSettings()
	const setTheme = (theme) => {
		setCurrentTheme(theme)

		if(window != null){
			window.localStorage.setItem('theme', JSON.stringify(theme))
		}
	}

	// set theme on mount
	useEffect(() => {
		if(window.localStorage.getItem('theme') == null){
			setTheme(defaultTheme);
		}

		try{
			setTheme(JSON.parse(window.localStorage.getItem("theme")))
		}catch(e){
			setTheme(defaultTheme)
		}
	}, [])

	useEffect(() => {		
		// set global css variables based on theme
		document.documentElement.style.setProperty('--primary-color', currentTheme.primaryColor)
		document.documentElement.style.setProperty('--secondary-color', currentTheme.secondaryColor)
		document.documentElement.style.setProperty('--background-color', currentTheme.backgroundColor)
		document.documentElement.style.setProperty('--selection-color', currentTheme.selectionColor)
		document.documentElement.style.setProperty('--background-image', currentTheme.backgroundImage)
		document.documentElement.style.setProperty('--background-blur', currentTheme.backgroundBlur)
		document.documentElement.style.setProperty('--background-color-blend', currentTheme.backgroundColorBlend)
	}, [currentTheme])

	useEffect(() => {
		const dropListener = document.addEventListener('drop', async (e) => {
			e.preventDefault();
			e.stopPropagation();
			for (let f of e.dataTransfer.files) {
				const data = await window.electron.file.json(f.path);
				if(data.primaryColor){
					setCurrentTheme(data);
					// remove any themes with the same name
					setCurrentSettings(prev => ({...prev, themes: prev.themes.filter(t => t.name !== data.name)}))
					setCurrentSettings(prev => ({ ...prev, themes: [...prev.themes, data] }))
				}
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
		<ThemeContext.Provider value={{currentTheme, setTheme}}>
			{children}
		</ThemeContext.Provider>
	)
}

const useTheme = () => useContext(ThemeContext)

export default useTheme

