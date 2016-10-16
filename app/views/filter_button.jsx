'use babel';
import React from 'react';
const ipc = require('electron').ipcRenderer;

class FilterButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: this.props.active
		}
		this.flipActive = this.flipActive.bind(this);
	}
	flipActive() {
		var active = !this.state.active
		this.setState({active: active});
		ipc.send("filter", this.props.filterType, this.props.filterIndex, !active);
	}
	render() {
		var active = (this.state.active) ? " active" : "";
		var className = "btn btn-default" + active;
		return (
			<button className={ className } onClick={ this.flipActive }>
				<span className={`icon icon-${ this.props.icon }`}></span>
			</button>
		);
	}
}

export default FilterButton;