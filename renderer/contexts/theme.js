import { useContext, useState, createContext, useEffect } from 'react'

// import all themes
import interstellar from '../assets/styles/terminal/interstellar.module.sass'
import matrix from '../assets/styles/terminal/matrix.module.sass'
import dark from '../assets/styles/terminal/dark.module.sass'
import sleek from '../assets/styles/terminal/sleek.module.sass'
import power from '../assets/styles/terminal/power.module.sass'
import pure from '../assets/styles/terminal/pure.module.sass'
import scifi from '../assets/styles/terminal/scifi.module.sass'
import sunset from '../assets/styles/terminal/sunset.module.sass'
import tron from '../assets/styles/terminal/tron.module.sass'
import vader from '../assets/styles/terminal/vader.module.sass'


const ThemeContext = createContext(matrix)

export const ThemeProvider = ({theme, children}) => {

	const [currentTheme, setCurrentTheme] = useState(theme || matrix)
	const setTheme = (theme) => {

		switch(theme) {
			case 'interstellar':
				setCurrentTheme(interstellar)
				break
			case 'dark':
				setCurrentTheme(dark)
				break
			case 'sleek':
				setCurrentTheme(sleek)
				break
			case 'power':
				setCurrentTheme(power)
				break
			case 'pure':
				setCurrentTheme(pure)
				break
			case 'scifi':
				setCurrentTheme(scifi)
				break
			case 'sunset':
				setCurrentTheme(sunset)
				break
			case 'tron':
				setCurrentTheme(tron)
				break
			case 'vader':
				setCurrentTheme(vader)
				break
			default:
				setCurrentTheme(matrix)
				break
		}

		if(window != null){
			window.localStorage.setItem('theme', theme)
		}
	}

	// set theme on mount
	useEffect(() => {
		setTheme(window.localStorage.getItem("theme") || 'matrix')
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

	return (
		<ThemeContext.Provider value={{currentTheme, setTheme}}>
			{children}
		</ThemeContext.Provider>
	)
}

const useTheme = () => useContext(ThemeContext)

export default useTheme

