'use strict';

var transform = require('jstransform').transform,
	reactTagVisitor = require('./lib/tagVisitor');

/**
 * JSX process to handle specified JSX tag name
 * @param inputString {string} JSX source
 * @param tagHandler(s) {object} or {Array}
 * 		{
	 * 			"tagName": "pre",
	 * 			"onTag": function(attrs) {
	 *				return attrs.key;
	 *			}
	 * 		}
 * @returns outputString {string}
 */
function process(inputString, tagHandler) {
	var tagHandlers = Array.isArray(tagHandler) ? tagHandler : [tagHandler],
		visitors = tagHandlers.map(function(handler) {
			return reactTagVisitor(handler.tagName, handler.onTag);
		});

	return transform(visitors, inputString).code;
}

var JsxPreprocessor = {
	process: process
};

module.exports = JsxPreprocessor;