import { useEffect, useState} from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import 'xterm/css/xterm.css'
import useTheme from '../contexts/theme';

import introAudioFile from '../assets/audio/keyboard.mp3'
import stdinAudioFile from '../assets/audio/type.mp3'
import stdoutAudioFile from '../assets/audio/folder.mp3'
import backspaceAudioFile from '../assets/audio/panels.mp3'
import clearAudioFile from '../assets/audio/granted.mp3'
import exitAudioFile from '../assets/audio/denied.mp3'
import escapeAudioFile from '../assets/audio/scanFast.mp3'
import tabAudioFile from '../assets/audio/typing.mp3'

const XTerm = (props) => {
	const {currentTheme} = useTheme()
	const fitAddon = new FitAddon()
	const [terminal, setTerminal] = useState(new Terminal(
		{
			convertEol: true,
			rows: 40,
			cols: 100
		}))
	const introAudio = new Audio(introAudioFile);
	const stdinAudio = new Audio(stdinAudioFile);
	const stdoutAudio = new Audio(stdoutAudioFile);
	const backspaceAudio = new Audio(backspaceAudioFile);
	const clearAudio = new Audio(clearAudioFile);
	const exitAudio = new Audio(exitAudioFile);
	const escapeAudio = new Audio(escapeAudioFile);
	const tabAudio = new Audio(tabAudioFile);

	// init
	useEffect(() => {
		terminal.options.allowTransparency = true;
		terminal.options.scrollback = props.disableScroll ? 0 : 10000;
		terminal.loadAddon(fitAddon)
		terminal.open(props.forwardedRef.current)
		fitAddon.activate(terminal)
		fitAddon.fit()

		props.setTerminal(terminal)

		if (props.onKey) {
			terminal.onKey(props.onKey)
		}

		if (props.useAudio) {
			terminal.onKey(audioListener)
			terminal.onLineFeed(audioLineFeedListener)
		}

		if (props.usePty) {
			window.electron.terminal.on((event, data) => {
				terminal.writeUtf8(data)
			})

			terminal.onKey((data) => {
				window.electron.terminal.send(data.key)
			})

			window.electron.terminal.resize(terminal.cols, terminal.rows)
		}

		// observe changes in the terminal size
		new ResizeObserver(() => {
			if(Number.isNaN(fitAddon.proposeDimensions().cols) || Number.isNaN(fitAddon.proposeDimensions().rows)) {
				return
			}
			fitAddon.fit()
			window.electron.terminal.resize(terminal.cols, terminal.rows)
		}).observe(terminal.element)

		setTerminal(terminal)
	}, [])

	useEffect(() => {
		terminal.options.theme = {
			background: "rgba(0, 0, 0, 0)",
			foreground: currentTheme.primaryColor,
			cursor: currentTheme.primaryColor,
			cursorAccent: currentTheme.primaryColor,
			selection: currentTheme.selectionColor,
		}
		setTerminal(terminal)
	}, [currentTheme])

	useEffect(() => {
		if (props.useIntro && props.isActive) {
			setTimeout(() => {
				introAudio.currentTime = 0
				introAudio.play()
			}, props.introAudioDelay)
		}
	}, [props.isActive])

	const audioListener = (data) => {
		if (data.key === '\r') {
			// enter key pressed
			stdoutAudio.currentTime = 0
			stdoutAudio.volume = 1
			stdoutAudio.play()
		} else if (data.key === '\t') {
			tabAudio.currentTime = 0
			tabAudio.volume = 0.8
			tabAudio.play()
		} else if (data.key === '\x7F' || data.key === '\x15') {
			// backspace or ctrl+u or ctr+w key pressed
			backspaceAudio.currentTime = 0
			backspaceAudio.volume = 0.5
			backspaceAudio.play()
		} else if (data.key === '\x1B') {
			// escape key pressed
			escapeAudio.currentTime = 0
			escapeAudio.volume = 0.1
			escapeAudio.play()
		} else if (data.key === '\f') {
			// ctrl+l key pressed
			clearAudio.currentTime = 0
			clearAudio.volume = 0.3
			clearAudio.play()
		} else if (data.key === '\x03') {
			// ctrl-c key pressed
			exitAudio.currentTime = 0
			exitAudio.volume = 1
			exitAudio.play()
		} else {
			stdinAudio.currentTime = 0
			stdinAudio.volume = 0.02
			stdinAudio.play()
		}
	}

	const audioLineFeedListener = () => {
		stdoutAudio.currentTime = 0
		stdoutAudio.volume = 0.5
		stdoutAudio.play()
	}

	return (
		<div id="terminal" className="fullHeight" ref={props.forwardedRef}></div>
	)
}

export default XTerm;