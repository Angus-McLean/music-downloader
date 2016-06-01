// vubey.downloader.js

var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	request = require('request'),
	async = require('async'),
	querystring = require('querystring'),
	httpHelpers = require('./../lib/httpHelpers.js'),
	settings = require(__dirname + '.\\..\\config\\constants.js');

function VubeyDownloader(songUrl) {
	
	if(!httpHelpers.validURL(songUrl)){
		console.error('Download Object requires a valid songUrl', songUrl);
		return null;
	}
	
	// Initialize events
	EventEmitter.call(this);
	
	this.type = 'vubey.yt';
	this.status = 'LOADING';
	this.loadLink = songUrl;
	this.downloadLink = null;
}

util.inherits(VubeyDownloader, EventEmitter);

VubeyDownloader.prototype.start = function () {
	var _this = this;
	async.waterfall([
		postLinkToVubeyDownloader.bind(null, _this.loadLink),
		parseLoadingPageHash,
		checkUntilFinished,
		downloadPreFlight.bind(_this)
	], function (err, downloadLink) {
		if(err){
			_this.status = 'FAILED';
			_this.emit('FAILED');
		} else {
			// start the download and pass the read stream to emit
			_this.status = 'DOWNLOADING';
			_this.downloadRequest = request(downloadLink);
			
			// handle any possible errors when piping the download
			_this.downloadRequest.on('error', function (resp) {
				console.error('DOWNLOAD_ERROR', resp);
				_this.status = 'ERROR';
				_this.emit('ERROR', resp);
			});
			
			// emit DOWNLOADING event
			_this.emit('DOWNLOADING', _this.downloadRequest);
		}
	});
};

function postLinkToVubeyDownloader(songUrl, cb) {
	var formObj = {
		videoURL : songUrl,
		quality : '320'
	};
	var formData = querystring.stringify(formObj);

	var options = {
		url : 'https://vubey.yt/',
		headers: {
		  'Content-Length': formData.length,
		  'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: formData,
		method: 'POST'
	};

	request(options, function (err, res, body) {
		return (!err) ? cb(null, body) : cb(err, res);
	});
}

function parseLoadingPageHash(body, cb) {
	var res_arr = body.match(/<meta http\-equiv\=\"refresh\" content=\"10; url=\/\?download=([A-z0-9]{32})\">/);

	if(Array.isArray(res_arr)){
		var vubeyUrl = 'https://vubey.yt/?download='+res_arr[1];
		cb(false, vubeyUrl);
	} else {
		cb(true, 'couldn\'t parse out vubey download id');
	}
}

function checkUntilFinished(pageLink, cb) {
	
	httpHelpers.getBody(pageLink, function (err, body) {
		
		var pageObj = checkVubeyStatus(body);
		
		// reload the page
		if(pageObj.status == 'loading'){
			setTimeout(function () {
				checkUntilFinished(pageLink, cb);
			}, settings.vubey.waitBeforeRefresh);
		// Download is finished pass the download link to callback
		} else if(pageObj.status == 'finished'){
			console.log('Finished : ', pageObj);
			cb(null, pageObj.link);
		// Download failed
		} else if(pageObj.status == 'failed'){
			console.log('Failed : ', pageObj);
			cb('DOWNLOADER_FAILED', pageObj);
		// Unrecognized status.
		} else {
			console.error('unrecognized status', pageObj);
			cb('ERROR', pageObj);
		}
	});
}

function checkVubeyStatus (bodyStr, cb) {
	
	var loadingRes = bodyStr.match(/Please wait, your video is being converted to MP3../);
	var errorRes = bodyStr.match(/Error downloading video, please use a different URL./);
	var finishedRes = bodyStr.match(/<a href="(.+)">here<\/a>/);

	if(Array.isArray(loadingRes) && loadingRes.length){
		// file is not done yet
		return {
			status : 'loading'
		};
	} else if(Array.isArray(finishedRes) && finishedRes.length) {
		return {
			status : 'finished',
			link : finishedRes[1]
		};
	} else if(Array.isArray(errorRes) && errorRes.length){
		console.log(bodyStr.match(/<div class="w-container container">.+addthis_sharing_toolbox/));
		return {
			status : 'failed'
		};
	}
}

function downloadPreFlight(downloadLink, cb) {

	this.downloadLink = downloadLink;
	this.status = 'READY';
	this.emit('READY', downloadLink);
	cb(null, downloadLink);
}

module.exports = VubeyDownloader;