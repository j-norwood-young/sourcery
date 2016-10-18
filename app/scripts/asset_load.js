const ipc = require('electron').ipcRenderer;
const fs = require("fs");
const exif = require('fast-exif');
const { fileinfo, filetype, pdf, docx } = require(__dirname + "/../lib/meta-geta.js");
const async = require("async");
const path = require("path");
const maxdepth = 1;

const imgFormats = [".jpg", ".jpeg", ".gif", ".gifv", ".png", ".bmp"];

var imgFile = (fname) => {
	var ext = path.extname(fname);
	if (imgFormats.indexOf(ext) != -1) {
		console.log("Image");
		return fname;
	}
	if (ext == ".pdf") {
		return path.join(__dirname, "../../assets/icons/pdf.svg");
	}

	if (ext == ".docx") {
		return path.join(__dirname, "../../assets/icons/docx.png");
	}
	console.log("Not found", ext);
};

var parseFiletype = (fname) => {
	var ext = path.extname(fname);
	if (ext === ".pdf") return pdf(fname);
	if (ext === ".docx") return docx(fname);
};

var processFile = (fname, depth) => {
	console.log("Checking", fname);
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
		return filetype(fname);
	})
	.then((result) => {
		data.filetype = result;
		return parseFiletype(fname);
	})
	.then((result) => {
		console.log(result);
		if (result)
			data.meta = result;
	})
	.then((result) => {
		data.img = imgFile(fname);
		ipc.send("asset-parsed", data);
	}, (err) => { console.log(err); });
};

ipc.on('selected-directory', function (event, path) {
	path.forEach((fname) => { processFile(fname); });
});