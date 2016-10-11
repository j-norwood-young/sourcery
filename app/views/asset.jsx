'use babel';
import React from 'react';
const path = require("path");
const prettyBytes = require('pretty-bytes');
const ipc = require('electron').ipcRenderer;
const shell = require('electron').shell;

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


var parsePDF = function(obj) {
	let flatPDF = flattenObject(obj);
	var result = [];
	for (let i in flatPDF) {
		result.push(<div className="pdfinfo"><strong>{i}</strong> {flatPDF[i]}</div>);
	}
	return result;
}

class Asset extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
	}
	
	render() {
		console.log("Rendering");
		this.state = { exif: [], features: [] };
		this.state.features.push(<span className="icon icon-calendar"></span>);
		this.state.shortfname = path.basename(this.props.asset.filename);
		this.state.filesize = prettyBytes(this.props.asset.fileinfo.size);
		if (this.props.asset.exif) {
			this.state.exif = parseExif(this.props.asset.exif);
			this.state.features.push(<span className="icon icon-camera"></span>);
			if (this.props.asset.exif.gps) {
				this.state.features.push(<span className="icon icon-location"></span>);
			}
		}
		if (this.props.asset.pdf) {
			this.state.pdf = parsePDF(this.props.asset.pdf);
			this.state.features.push(<span className="icon icon-info"></span>);
		}
		if (this.props.preview) {
			return (
				<div className="asset" onClick={ () => { assetClick(this.props.asset) } }>
					<h5>{ this.state.shortfname }</h5>
					<div className="pull-left pad-right half">
						<img src={this.props.asset.img} />
					</div>
					<div className="pull-left half">
						<div>{ this.state.filesize }</div>
						<div className="featureIcons">
							{ this.state.features }
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="detail">
					<h5>{ this.state.shortfname }</h5>
					<div className="img-container">
						<img src={this.props.asset.img} />
					</div>
					<div className="">
						<div className="btn btn-primary" onClick={ () => shell.openItem(this.props.asset.filename) }>Open</div>
						<div>{ this.state.filesize }</div>
						<div className="featureIcons">
							{ this.state.features }
						</div>
					</div>
					<p>
						<strong>Change Time</strong> { this.props.asset.fileinfo.ctime }<br />
						<strong>Modified Time</strong> { this.props.asset.fileinfo.mtime }<br />
						<strong>Access Time</strong> { this.props.asset.fileinfo.atime }<br />
						<strong>Birthtime</strong> { this.props.asset.fileinfo.birthtime }
					</p>
					<p>
						{ this.state.exif }
					</p>
					<p>
						{ this.state.pdf }
					</p>
				</div>
			);
		}
	}
}

export default Asset;