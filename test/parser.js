/*global describe:false, before:false, after:false, it:false*/
'use strict';

var assert = require('assert'),
	JsxPreprocessor = require('..');

describe('process', function () {

	it('should replace `pre` tag by handler', function () {
		var handler = {
			tagName: 'pre',

			onTag: function (attrs) {
				return 'awesome preprocessor';
			}
		};

		var res,
			src = 'React.render(<div><h1>Hello, world!</h1><pre type="content" /></div>,document.getElementById("example"));';

		res = JsxPreprocessor.process(src, handler);

		assert.strictEqual(res, 'React.render(<div><h1>Hello, world!</h1>awesome preprocessor</div>,document.getElementById("example"));');
	});

	it('should handle multiple handlers', function () {
		var handlers = [{
				tagName: 'pre1',

				onTag: function (attrs) {
					return 'awesome preprocessor1';
				}
			},
			{
				tagName: 'pre2',

				onTag: function (attrs) {
					return 'awesome preprocessor2';
				}
			}];

		var res,
			src = 'React.render(<div><h1>Hello, world!</h1><pre1 type="content" /><pre2 type="content" /></div>,document.getElementById("example"));';

		res = JsxPreprocessor.process(src, handlers);

		assert.strictEqual(res, 'React.render(<div><h1>Hello, world!</h1>awesome preprocessor1awesome preprocessor2</div>,document.getElementById("example"));');
	});

	it('should pass attributes to the handler', function () {
		var handler = {
			tagName: 'pre',

			onTag: function (attrs) {
				return JSON.stringify(attrs);
			}
		};

		var res,
			src = 'React.render(<div><h1>Hello, world!</h1><pre key1="value1" key2="value2" /></div>,document.getElementById("example"));';

		res = JsxPreprocessor.process(src, handler);

		assert.strictEqual(res, 'React.render(<div><h1>Hello, world!</h1>{"key1":"value1","key2":"value2"}</div>,document.getElementById("example"));');
	});
});