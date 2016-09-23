"use strict";

let fs = require("fs");

function fileinfo(fname) {
	return new Promise((resolve, reject) => {
		fs.stat(fname, (err, stats) => {
			if (err)
				return reject(err);
			return resolve(stats);
		});
	});
}

module.exports = { fileinfo };