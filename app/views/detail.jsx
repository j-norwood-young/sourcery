'use babel';
import React from 'react';
const path = require("path");
const prettyBytes = require('pretty-bytes');
const ipc = require('electron').ipcRenderer;

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

class Detail extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
	}
	
	render() {
		console.log("Rendering");
		this.state = { exif: [], features: [] };
		this.state.features.push(<span className="icon icon-calendar"></span>);
		this.state.shortfname = path.basename(this.props.filename);
		this.state.filesize = prettyBytes(this.props.fileinfo.size);
		if (this.props.exif) {
			this.state.exif = parseExif(this.props.exif);
			this.state.features.push(<span className="icon icon-camera"></span>);
			if (this.props.exif.gps) {
				this.state.features.push(<span className="icon icon-location"></span>);
			}
		}
		// var active = (this.state.active) ? ("btn-active") : "";
		return (
			<div className="detail">
				<h5>{ this.state.shortfname }</h5>
				<div className="img-container">
					<img src={this.props.filename} />
				</div>
				<div className="">
					<div>{ this.state.filesize }</div>
					<div className="featureIcons">
						{ this.state.features }
					</div>
				</div>
				<p>
					<strong>Change Time</strong> { this.props.fileinfo.ctime }<br />
					<strong>Modified Time</strong> { this.props.fileinfo.mtime }<br />
					<strong>Access Time</strong> { this.props.fileinfo.atime }<br />
					<strong>Birthtime</strong> { this.props.fileinfo.birthtime }
				</p>
				<p>
					{ this.state.exif }
				</p>
			</div>
		);
	}
}

export default Detail;