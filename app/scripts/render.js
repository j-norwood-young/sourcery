"use babel";
import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../views/main.jsx';
import ItemPreview from "../views/item_preview.jsx";
import Toolbar from "../views/toolbar.jsx";
import Assets from "../views/assets.jsx";
import Asset from "../views/asset.jsx";
import Landing from "../views/landing.jsx";
const ipc = require('electron').ipcRenderer;

var Render = function() {
	ReactDOM.render(<Toolbar />, document.getElementById("toolbarButtons"));
	ReactDOM.render(<Landing />, document.getElementById("windowContent"));
	ipc.on("selected-directory", (event) => {
		ReactDOM.render(<Assets />, document.getElementById("windowContent"));
	});
	// 
	ipc.on("home", () => {
		ReactDOM.render(<Landing />, document.getElementById("windowContent"));
	});
	ipc.on("clear-workspace", (event) => {
		ReactDOM.render(<div></div>, document.getElementById("detail"));
	});
};

module.exports = Render;