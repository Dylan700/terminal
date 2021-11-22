import '../assets/styles/global.sass'
import Main from './index'
import { ThemeProvider } from '../contexts/theme'
import { SettingsProvider } from '../contexts/settings'

export default function App({ Component, pageProps }) {
	return (
		<ThemeProvider>
			<SettingsProvider>
				<Main {...pageProps} />
			</SettingsProvider>
		</ThemeProvider>
	)
}
