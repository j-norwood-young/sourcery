'use babel';
import React from 'react';

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

class Asset extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = { exif: [] };
		if (props.exif) {
			let exif = flattenObject(props.exif);
			console.log(exif);
			for (let i in exif) {
				console.log(i, exif[i])
				this.state.exif.push(<div className="exif"><strong>{i}</strong> {exif[i]}</div>);
			}
		}
	}
	
	render() {
		// var active = (this.state.active) ? ("btn-active") : "";
		return (
			<div className="asset">
				<img src={this.props.filename} />
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

export default Asset;