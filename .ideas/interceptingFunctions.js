// interceptingFunctions.js

// intercept functions
console.log = (function () {
	var orig = console.log;
	return function(){
		orig.apply(this, ['swag']);
		return orig.apply(this, arguments);
	}
})();



// intercept constructors
XMLHttpRequest = (function () {
	var orig = XMLHttpRequest;
	return function(){
		// interception code here
		return orig.apply(this, arugments);
	};
})
