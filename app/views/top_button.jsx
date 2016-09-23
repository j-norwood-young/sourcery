'use babel';
import React from 'react';

class TopButton extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		// var active = (this.state.active) ? ("btn-active") : "";
		return (
			<button className="btn btn-default" onClick={ this.props.onClick }>
				<span className={`icon icon-${ this.props.icon }`}></span>
			</button>
		);
	}
}

export default TopButton;