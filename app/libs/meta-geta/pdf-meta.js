"use strict";

const fs = require("fs");
const pdfjs = require("../pdf.js/generic/build/pdf.js");

var getMeta = (fname) => {
	var fdata = new Uint8Array(fs.readFileSync(fname));
	return pdfjs.getDocument(fdata)
	.then((doc) => {
		return doc.getMetadata();
	});
};

module.exports = {
	get_meta: getMeta
};