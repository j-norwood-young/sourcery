'use babel';
import React from 'react';

class TopButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: this.props.active
		}
	}
	flipActive() {
		this.state.active = !this.state.active;
	}
	render() {
		var active = (this.state.active) ? " active" : "";
		var className = "btn btn-default" + active;
		return (
			<button className={ className } onClick={ this.props.onClick }>
				<span className={`icon icon-${ this.props.icon }`}></span>
			</button>
		);
	}
}

export default TopButton;