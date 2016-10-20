'use babel';

import React from 'react';
import Asset from "./asset.jsx";
const ipc = require('electron').ipcRenderer;

class Assets extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			children: [],
			detail: null
		};
		ipc.on("asset-parsed", (event, asset) => {
			console.log("Setting asset", asset)
			this.setState({ children: this.state.children.concat([(<Asset key={ asset.filename } asset={ asset } preview={ true } />)]) } );
		});
		ipc.on("asset-detail", (sender, asset) => {
			// First we clear the element, to stop stupid React from updating state instead of replacing the entire thing
			this.setState({ detail: <Asset asset={ asset } key={ asset.filename } /> });
		});
		ipc.on("clear-workspace", (event) => {
			console.log("Clearing workspace");
			this.setState({ children: [] });
		});
		ipc.on("filter", (event, filters) => {
			console.log("Filter", filters);
		// 	var filters = this.state.filters;
		// 	filters[id] = state;
		// 	this.setState({ filters: filters });
		});
	}
	render()  {
		return <div>
			<div id="assets">
			{ this.state.children }
			</div>
			<div id="detail">
			{ this.state.detail }
			</div>
		</div>;
	}
}

export default Assets;