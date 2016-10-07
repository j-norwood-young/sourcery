'use babel';
import React from 'react';
const path = require("path");
const prettyBytes = require('pretty-bytes');
const ipc = require('electron').ipcRenderer;

// https://gist.github.com/penguinboy/762197
var flattenObject = function(ob) {
	var toReturn = {};
	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		
		if ((typeof ob[i]) == 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

var filterExif = (exif) => {
	let removeProps = [ "image.Padding", "exif.Padding", "exif.UserComment" ]
	let tmp = {};
	for(let i in exif) {
		let pass = true;
		removeProps.forEach((removeProp) => {
			if (i.indexOf(removeProp) !== -1)
				pass = false;
		});
		if (pass)
			tmp[i] = exif[i];
	}
	return tmp;
}

var parseExif = (exif) => {
	var exifPossibleFeatures = { 
		"image.Software": "Software",
		"image.Make": "Device Make",
		"image.Model": "Device Model",
		"exif.DateTimeOriginal": "Original Time",
		"exif.DateTimeDigitized": "Digitized Time",
		"image.ModifiedDate": "Modified Time",

	}
	if (!exif) return null;
	var result = [];
	let flatExif = filterExif(flattenObject(exif));
	// console.log(flatExif);
	for (let i in flatExif) {
		// console.log(i, flatExif[i])
		result.push(<div className="exif"><strong>{i}</strong> {flatExif[i]}</div>);
	}
	return result;
}

var assetClick = function(data) {
	console.log("Caught click");
	ipc.send("asset-clicked", data);
}

class Asset extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = { exif: [], features: [] };
		this.state.features.push(<span className="icon icon-calendar"></span>);
		this.state.shortfname = path.basename(this.props.filename);
		this.state.filesize = prettyBytes(this.props.fileinfo.size);
		if (props.exif) {
			this.state.exif = parseExif(props.exif);
			this.state.features.push(<span className="icon icon-camera"></span>);
			if (props.exif.gps) {
				this.state.features.push(<span className="icon icon-location"></span>);
			}
		}
	}
	
	render() {
		// var active = (this.state.active) ? ("btn-active") : "";
		return (
			<div className="asset" onClick={ () => { assetClick(this.props) } }>
				<h5>{ this.state.shortfname }</h5>
				<div className="pull-left pad-right half">
					<img src={this.props.filename} />
				</div>
				<div className="pull-left half">
					<div>{ this.state.filesize }</div>
					<div className="featureIcons">
						{ this.state.features }
					</div>
				</div>
			</div>
		);
	}
}

export default Asset;