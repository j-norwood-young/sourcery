'use babel';
import React from 'react';
const path = require("path");
const prettyBytes = require('pretty-bytes');
const ipc = require('electron').ipcRenderer;
const shell = require('electron').shell;
import Mymap from "./map.jsx";

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

var extClasses = {
	"img": [ ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".tiff" ],
	"doc": [ ".pdf", ".doc", ".docx", ".odf", ".pages", ".txt", ".rtf", ".epub"],
	// https://en.wikipedia.org/wiki/Video_file_format
	"vid": [ ".mp4", ".m4v", ".m4p", ".mpg", ".mpeg", ".mpv", ".mp2", ".m2v", ".3gp", ".3g2", ".avi", ".mov", ".qt", ".wmv", ".webm", ".mkv", ".flv", ".f4v", ".f4p", ".f4a", ".f4b", ".vob", ".ogv", ".gifv", ".yuv",  ],
	"unknown": [ "unknown" ],
}

var getExtClass = (filename) => {
	var ext = path.extname(filename);
	for (var i in extClasses) {
		if (extClasses[i].indexOf(ext) !== -1) {
			return i;
		}
	}
	return "unknown";
}

class Asset extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = { exif: [], features: [], active: false };
		this.state.features.push(<span className="icon icon-calendar"></span>);
		this.state.shortfname = path.basename(this.props.asset.filename);
		this.state.filesize = prettyBytes(this.props.asset.fileinfo.size);
		this.state.f = [ "all" ];
		this.state.gps = [];
		if (this.props.asset.exif) {
			this.state.exif = parseExif(this.props.asset.exif);
			this.state.features.push(<span className="icon icon-camera"></span>);
			this.state.f.push("exif");
			if (this.props.asset.exif.gps && this.props.asset.exif.gps.GPSLatitude) {
				this.state.features.push(<span className="icon icon-location"></span>);
				this.state.f.push("location");
				var lat = this.props.asset.exif.gps.GPSLatitude[0] + (this.props.asset.exif.gps.GPSLatitude[1] / 60) + (this.props.asset.exif.gps.GPSLatitude[2] / 3600);
				var lng = this.props.asset.exif.gps.GPSLongitude[0] + (this.props.asset.exif.gps.GPSLongitude[1] / 60) + (this.props.asset.exif.gps.GPSLongitude[2] / 3600);
				if (this.props.asset.exif.gps.GPSLongitudeRef === "W")
					lng *= -1;
				if (this.props.asset.exif.gps.GPSLatitudeRef === "S")
					lat *= -1;
				this.state.center = [ lat, lng ];
				this.state.gps.push(<Mymap position={ this.state.center } />);
			}
		}
		if (this.props.asset.pdf) {
			this.state.pdf = parsePDF(this.props.asset.pdf);
			this.state.features.push(<span className="icon icon-info"></span>);
			this.state.f.push("meta");
		}
		ipc.on("asset-detail", (sender, asset) => {
			if (asset.filename === this.props.asset.filename) {
				this.state.active = true;
			} else {
				this.state.active = false;
			}
		});
		ipc.on("filter", (sender, filters) => {
			// console.log(filters);
			// console.log("f", this.state.f);
			var foundFile = false;
			var fileClass = getExtClass(this.props.asset.filename);
			for(var i in filters.file) {
				if (filters.file[i] && (i == fileClass)) {
					foundFile = true;
					break;
				}
			}
			var foundFeature = false;
			for(var i in filters.feature) {
				console.log("Checking", i);
				if (filters.feature[i] && (this.state.f.indexOf(i) !== -1)) {
					console.log("Found");
					foundFeature = true;
					break;
				}
			}
			console.log(foundFile, foundFeature);
			var display = foundFile && foundFeature;
			// console.log("Hide", !display);
			this.setState({ hidden: !display });
		});
	}
	
	render() {
		console.log("Rendering", this.state);
		if (this.props.preview) {
			var className = "asset";
			if (this.state.active) {
				className += " active";
			}
			if (this.state.hidden) {
				className += " hidden";
			}
			return (
				<div className={ className } onClick={ () => { assetClick(this.props.asset) } }>
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
					{ this.state.gps }
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