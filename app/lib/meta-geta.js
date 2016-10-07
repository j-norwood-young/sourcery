"use strict";

const fs = require("fs");
const identify = require("identify-filetype");

var filetype = (fname) => {
	return new Promise((resolve, reject) => {

		try {
			fs.readFile(fname, (err, buffer) => {
				if (err)
					return reject(err);
				resolve(identify(buffer));
			});
		} catch(err) {
			reject(err);
		}
	});
}

function fileinfo(fname) {
	return new Promise((resolve, reject) => {
		fs.stat(fname, (err, stats) => {
			if (err)
				return reject(err);
			return resolve(stats);
		});
	});
}

module.exports = { fileinfo, filetype };