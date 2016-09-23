'use babel';

import React from 'react';

export default class ItemPreview extends React.Component {
	render() {
		return
			<div className="item-preview">
				<img src="{ this.props.img }" className="thumbnail" />
			</div>;
		;
	}
}