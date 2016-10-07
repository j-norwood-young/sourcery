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
		ReactDOM.render(<Asset asset={ asset } />, document.getElementById("detail"));
	});
};

module.exports = Render;