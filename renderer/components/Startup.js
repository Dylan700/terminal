import React from 'react'
import dynamic from 'next/dynamic';

// Dynamically imported component
const XTerm = dynamic(() => import('../components/XTerm'), {ssr: false});
const ForwardedRefTerminal = React.forwardRef((props, ref) => (
	<XTerm {...props} forwardedRef={ref} />
))

import bootText from '../assets/boots/matrix.txt'

export default class Startup extends React.Component {
	constructor(props) {
		super(props)
		this.terminalRef = React.createRef()
		this.setTerminal = this.setTerminal.bind(this)
		this.state = {terminal: null}
	}

	componentDidMount() {
		console.log('this.terminalRef', this.terminalRef)
	}

	componentDidUpdate() {
		if(this.state.terminal){
			this.runBootSequence();
		}
	}

	runBootSequence(){
		var lines = bootText.split("\n")
		lines = lines.map(line => {
			return {
				text: line,
				time: (line === " ") ? 250 : 20
			}
		})

		// for each line, write it after the delay, and take into account all previous delays
		var delay = 0
		lines.forEach(line => {
			setTimeout(() => {
				this.state.terminal.writeln(line.text)

				if (lines.indexOf(line) === lines.length - 1) {
					setTimeout(() => {
						if(this.props.onComplete){
							this.props.onComplete()
						}
					}, 1500)
				}

			}, delay)
			delay += line.time
		})
	}

	setTerminal(t){
		this.setState({terminal: t})
	}

	render() {
		return <div>
			<ForwardedRefTerminal ref={this.terminalRef} setTerminal={this.setTerminal} useAudio={true} />
		</div>;
	}
}