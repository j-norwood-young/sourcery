const ipc = require('electron').ipcRenderer;
const fs = require("fs");
const exif = require('fast-exif');
const { fileinfo } = require(__dirname + "/../lib/meta-geta.js");
const async = require("async");
const path = require("path");
const maxdepth = 1;

var processFile = (fname, depth) => {
	depth = depth || 0;
	var data = { filename: fname };
	// console.log(`Processing ${fname} depth ${depth}`);
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
		data.fileinfo = result;
		return exif.read(fname);
	})
	.then((result) => {
		data.exif = result;
		ipc.send("asset-parsed", data);
		// console.log(data);
	}, (err) => { console.log(err); });
};

ipc.on('selected-directory', function (event, path) {
	path.forEach((fname) => { processFile(fname); });
});