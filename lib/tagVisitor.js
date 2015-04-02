'use strict';

var Syntax = require('jstransform').Syntax,
	utils = require('jstransform/src/utils'),
	SyntaxHelper = require('./SyntaxHelper');

function trimLeft(value) {
	return value.replace(/^[ ]+/, '');
}

/**
 * Create customized visitor to catch specified 'self-closing' tag(s)
 * @param tagName {string}
 * @param preprocessor {function} function to transpile JSX tag to whatever
 */
function createTagVisitor(tagName, preprocessor) {
	function tagVisitor(traverse, object, path, state) {
		var openingElement = object.openingElement,
			nameObject = openingElement.name,
			tagName = nameObject.name,
			attributesObject = openingElement.attributes;

		// Move position to the start of tag
		utils.catchup(openingElement.range[0], state, trimLeft);

		// Insert preprocessed result
		utils.append(preprocessor(attributesObject, tagName), state);

		// Move position to closing tag />
		utils.move(openingElement.range[1], state);
	}

	tagVisitor.test = function(object, path, state) {
		var openingElement = object.openingElement,
			nameObject = openingElement && openingElement.name;

		// Support only self-closing tag. <TagName .... /> at this moment.
		return object.type === Syntax.JSXElement &&
			openingElement && openingElement.type === Syntax.JSXOpeningElement && openingElement.selfClosing &&
			nameObject && nameObject.type === Syntax.JSXIdentifier &&
			nameObject.name === tagName;
	};

	return tagVisitor;
}

/**
 * Create handler following jstransformer's visitor interface
 * @param tagName {string}
 * @param onTagFound {function} callback
 * @returns {function} jstransformer's visitor
 */
module.exports = function(tagName, onTagFound) {
	return createTagVisitor(tagName, function preprocessor(attributesObject, tagName) {
		var attributeSet = SyntaxHelper.attribute(attributesObject);

		return onTagFound(attributeSet, tagName);
	});
};