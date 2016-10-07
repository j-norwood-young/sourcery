import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../views/main.jsx';
import ItemPreview from "../views/item_preview.jsx";
import Toolbar from "../views/toolbar.jsx";
import Assets from "../views/assets.jsx";
import Detail from "../views/detail.jsx";
const ipc = require('electron').ipcRenderer;

var Render = function() {
	ReactDOM.render(<Toolbar />, document.getElementById("toolbarButtons"));
	ReactDOM.render(<Assets />, document.getElementById("assets"));
	ipc.on("asset-detail", (sender, asset) => {
		ReactDOM.render(<Detail filename={ asset.filename } fileinfo={ asset.fileinfo } exif={ asset.exif } />, document.getElementById("detail"));
	});
};

module.exports = Render;