import React from 'react'
import dynamic from 'next/dynamic';

// Dynamically imported component
const XTerm = dynamic(() => import('../components/XTerm'), { ssr: false });
const ForwardedRefTerminal = React.forwardRef((props, ref) => (
	<XTerm {...props} forwardedRef={ref} />
))


export default class Terminal extends React.Component {
	constructor(props) {
		super(props)
		this.terminalRef = React.createRef()
		this.setTerminal = this.setTerminal.bind(this)
		this.state = { terminal: null, initialized: false }
	}

	componentDidUpdate() {
		if (this.state.terminal != null && !this.state.initialized) {
			this.state.terminal.focus()
			this.state.terminal.write('Connected to the Matrix.\n\nPress enter to continue.\n\n')
			this.setState({ ...this.state, initialized: true })
		}
	}

	setTerminal(t) {
		this.setState({...this.state, terminal: t})
	}

	render() {
		return <div className="fullHeight">
			<ForwardedRefTerminal ref={this.terminalRef} setTerminal={this.setTerminal} useAudio={this.props.useAudio} usePty={true} useIntro={this.props.useAudio} introAudioDelay={this.props.delay} isActive={this.props.isActive} disableScroll={this.props.disableScroll} />
		</div>;
	}
}