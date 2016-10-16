'use babel';

import React from 'react';
import Asset from "./asset.jsx";
const ipc = require('electron').ipcRenderer;

class Assets extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			children: [],
		};
		ipc.on("asset-parsed", (event, asset) => {
			console.log("Setting asset", asset)
			this.setState({ children: this.state.children.concat([(<Asset key={ asset.filename } asset={ asset } preview={ true } />)]) } );
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
		return <div className="asset-group">
			{ 
				this.state.children
			}
		</div>;
	}
}

export default Assets;