# jsx-tag-preprocessor

A simple JSX tag preprocessor

## Examples

```javascript
var JsxPreprocessor = require('jsx-tag-preprocessor');

var src = 'React.render(<div><h1>Hello, world!</h1><pre key1="value1" key2="value2" /></div>,document.getElementById("example"));';

var res = JsxPreprocessor.process(src, {
		tagName: 'pre',
		onTag: function (attrs) {
			return JSON.stringify(attrs);
		}
     });

console.log(res);
// React.render(<div><h1>Hello, world!</h1>{"key1":"value1","key2":"value2"}</div>,document.getElementById("example"));

```