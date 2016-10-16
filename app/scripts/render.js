import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../views/main.jsx';
import ItemPreview from "../views/item_preview.jsx";
import Toolbar from "../views/toolbar.jsx";
import Assets from "../views/assets.jsx";
import Asset from "../views/asset.jsx";
const ipc = require('electron').ipcRenderer;

var Render = function() {
	ReactDOM.render(<Toolbar />, document.getElementById("toolbarButtons"));
	ReactDOM.render(<Assets />, document.getElementById("assets"));
	ipc.on("asset-detail", (sender, asset) => {
		// First we clear the element, to stop stupid React from updating state instead of replacing the entire thing
		ReactDOM.render(<div></div>, document.getElementById("detail"));
		ReactDOM.render(<Asset asset={ asset } key={ asset.filename } />, document.getElementById("detail"));
	});
	ipc.on("clear-workspace", (event) => {
		ReactDOM.render(<div></div>, document.getElementById("detail"));
	});
};

module.exports = Render;