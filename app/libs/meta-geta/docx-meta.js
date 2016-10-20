"use strict";

const fs = require("fs");
const JSZip = require("jszip");
const Parser = require("xml-json-parser");
var parser = new Parser();

var getMeta = (fname) => {
	return new Promise((resolve, reject) => {
		var result = {};
		var zip = null;
		fs.readFile(fname, (err, data) => {
			if (err) return reject(err);
			JSZip.loadAsync(data)
			.then(function (result) {
				zip = result;
				console.log(zip);
				return zip.file("docProps/core.xml").async("string");
			})
			.then((xmlString) => {
				var xmlObj = parser.parseXmlString(xmlString);
				var json = parser.xml2json(xmlObj);
				if (json.coreProperties) {
					result.core = {};
					for (var i in json.coreProperties) {
						if (json.coreProperties[i].__text) {
							var s = json.coreProperties[i].toString();
							if (i.charAt(0) !== "_")
								result.core[i] = s;
						}
					}
				}
				return zip.file("docProps/app.xml").async("string");
			})
			.then((xmlString) => {
				var xmlObj = parser.parseXmlString(xmlString);
				var json = parser.xml2json(xmlObj);
				console.log(json);
				if (json.Properties) {
					result.app = {};
					for (var i in json.Properties) {
						var s = json.Properties[i];
						if (i.charAt(0) !== "_")
							result.app[i] = s;
					}
				}
				resolve(result);
			});
		});
	});
};

module.exports = {
	get_meta: getMeta
};