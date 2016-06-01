// httpHelpers.js

var request = require('request');

var URLregex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

function getBody(requestUrl, cb) {
	request(requestUrl, function (err, res, body) {
		if(!err){
			cb(null, body);
		} else {
			cb(err, res);
		}
	});
}

function validURL(str) {
	return (str && URLregex.test(str));
}

module.exports = {
	getBody : getBody,
	validURL : validURL
};