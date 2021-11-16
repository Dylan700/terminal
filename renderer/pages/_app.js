import '../assets/styles/global.sass'
import Main from './index'
import { ThemeProvider } from '../contexts/theme'

export default function App({ Component, pageProps }) {
	return (
		<ThemeProvider>
			<Main {...pageProps} />
		</ThemeProvider>
	)
}
