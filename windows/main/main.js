"use strict";
// define document

const ipc = require('electron').ipcRenderer;
const exif = require('fast-exif');
const { fileinfo } = require(__dirname + "/../../lib/meta-geta.js");
const fs = require("fs");
const async = require("async");
const path = require("path");
const maxdepth = 1;

var btnBrowse = document.getElementById("btnBrowse");
btnBrowse.addEventListener("click", () => {
	ipc.send('open-file-dialog');
});

var processFile = (fname, depth) => {
	depth = depth || 0;
	console.log(`Processing ${fname} depth ${depth}`);
	if (fs.lstatSync(fname).isDirectory()) {
		depth++;
		if (depth > maxdepth) {
			return Promise.resolve();
		}
		let files = fs.readdirSync(fname);
		let queue = [];
		files.forEach((subfname) => {
			queue.push((cb) => { 
				processFile(path.join(fname, subfname), depth)
				.then((result) => {
					return cb(null, result);
				}, (err) => {
					return cb(err);
				});
			});
		});
		return new Promise((resolve, reject) => {
			async.series(queue, (err, result) => {
				if (err)
					return reject(err);
				return resolve(result);
			});
		});
	}
	return fileinfo(fname)
	.then((result) => {
		console.log(result);
		return exif.read(fname).then(console.log).catch(console.error);
	}, (err) => { console.log(err); });
};

ipc.on('selected-directory', function (event, path) {
	console.log(path);
	document.getElementById('selected-file').innerHTML = `You selected: ${path}`;
	path.forEach((fname) => { processFile(fname); });
});