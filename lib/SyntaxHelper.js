'use strict';
var Syntax = require('jstransform').Syntax;

/**
 * Translate raw JSX syntax object to convenient form
 *
 * Example..
 *
 * Input tag: <TagName attr1="literal" attr2={this.props.foo} />
 *
 * Result object:
 * {
 * 		attr1: 'literal',
 * 		attr2: {
 * 			... jstransformer attribute value object
 * 		}
 * 	}
 *
 * @param attributesObject
 * @returns {object}
 */
function attributeProcessor(attributesObject) {
	return attributesObject.reduce(function(attrSet, attrObj) {
		var name,
			value,
			nameObj = attrObj.name,
			valueObj = attrObj.value;

		if (!valueObj || !nameObj) return;

		name = nameObj.name;

		switch (valueObj.type) {
			case Syntax.Literal:
				// set literal value for convenience
				value = valueObj.value;
				break;
			default:
				value = valueObj;
				break;
		}

		attrSet[name] = value;

		return attrSet;
	}, {});
}

var SyntaxHelper = {
	attribute: attributeProcessor
};

module.exports = SyntaxHelper;