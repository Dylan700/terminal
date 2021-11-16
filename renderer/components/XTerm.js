import { useEffect } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import 'xterm/css/xterm.css'
import variables from '../assets/styles/terminal.module.sass'

import introAudioFile from '../assets/audio/keyboard.mp3'
import stdinAudioFile from '../assets/audio/type.mp3'
import stdoutAudioFile from '../assets/audio/folder.mp3'
import backspaceAudioFile from '../assets/audio/panels.mp3'
import clearAudioFile from '../assets/audio/granted.mp3'
import exitAudioFile from '../assets/audio/denied.mp3'
import escapeAudioFile from '../assets/audio/scanFast.mp3'
import tabAudioFile from '../assets/audio/typing.mp3'

const XTerm = (props) => {
	const fitAddon = new FitAddon()
	const terminal = new Terminal(
		{
		convertEol: true,
		rows: 40,
		cols: 100
		});
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
		terminal.open(props.forwardedRef.current)
		terminal.loadAddon(fitAddon)
		fitAddon.fit()

		terminal.setOption('theme', {
			background: variables.background,
			foreground: variables.foreground,
			cursor: variables.cursor,
			cursorAccent: variables.cursorAccent,
			selection: variables.selection,
		})

		props.setTerminal(terminal)

		if(props.onKey){
			terminal.onKey(props.onKey)
		}

		if(props.useAudio){
			terminal.onKey(audioListener)
			terminal.onLineFeed(audioLineFeedListener)
		}

		if(props.usePty){
			window.electron.terminal.on((event, data) => {
				terminal.writeUtf8(data)
			})

			terminal.onKey((data) => { 
				window.electron.terminal.send(data.key)
			})

			window.electron.terminal.resize(terminal.cols, terminal.rows)
		}

	}, [])

	useEffect(() => {
		if (props.useIntro && props.isActive) {
			setTimeout(() => {
				introAudio.currentTime = 0
				introAudio.play()
			}, 1000)
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
		<div className="fullHeight" ref={props.forwardedRef}></div>
	)
}

export default XTerm;