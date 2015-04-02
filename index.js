'use strict';

var transform = require('jstransform').transform,
	reactTagVisitor = require('./lib/tagVisitor');

var out = transform([reactTagVisitor('pre', function(attrs) { console.log('wow', attrs); return 'new conent!!'; })],
	'React.render(<div><h1>Hello, world!</h1><pre type="content" key="info.billing-address" /></div>,document.getElementById("example"));');
console.log('@@ OUT @@', out);

/*
module.exports = {
	parse: function (inputString, callback) {

	}
};*/