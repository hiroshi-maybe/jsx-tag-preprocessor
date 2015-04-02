var Syntax = require('jstransform').Syntax,
	utils = require('jstransform/src/utils');

function trimLeft(value) {
	return value.replace(/^[ ]+/, '');
}

/**
 * Create customized visitor to catch specified self-closing tag(s)
 * @param tagNames {object}
 * @param codeMaker {function} function to generate code
 */
function createTagVisitor(tagSet, codeMaker) {
	function tagVisitor(traverse, object, path, state) {
		var openingElement = object.openingElement,
			nameObject = openingElement.name,
			tagName = nameObject.name,
			attributesObject = openingElement.attributes;

		// Move position to the start of tag
		utils.catchup(openingElement.range[0], state, trimLeft);

		// Insert code snippet
		utils.append(codeMaker(attributesObject, tagName), state);

		// Move position to closing tag />
		utils.move(openingElement.range[1], state);

		console.log('debug', object,'***', attributesObject, '***', state);
	}

	tagVisitor.test = function(object, path, state) {
		var openingElement = object.openingElement,
			nameObject = openingElement && openingElement.name;

		return object.type === Syntax.JSXElement &&
			openingElement && openingElement.type === Syntax.JSXOpeningElement && openingElement.selfClosing &&
			nameObject && nameObject.type === Syntax.JSXIdentifier &&
			tagSet[nameObject.name];
	};

	return tagVisitor;
}

module.exports = function(tagNames, onTagFound) {
	var tagSet;
	if (!Array.isArray(tagNames)) {
		tagNames = [tagNames];
	}

	tagSet = tagNames.reduce(function(tagSet, tagName) {
		tagSet[tagName] = true;
		return tagSet;
	}, {});

	return createTagVisitor(tagSet, function codeMaker(attributesObject, tagName) {
		var attributeSet = attributesObject.reduce(function(attrSet, attrObj) {
			var nameObj = attrObj.name,
				valueObj = attrObj.value;

			// Assuming value is literal
			if (valueObj && valueObj.type === Syntax.Literal) {
				attrSet[nameObj && nameObj.name] = valueObj && valueObj.value;
			}

			return attrSet;
		}, {});

		return onTagFound(attributeSet, tagName);
	});
};