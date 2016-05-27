// Download.object.js

var DefaultWriter = require('./../writers/default.writer.js');

var EventEmitter = require('events').EventEmitter,
	util = require('util');
	
var availableDownloaders = {
	vubey : require('./../downloaders/vubey.downloader.js')
};

var availableWriters = {
	default : require('./../writers/default.writer.js')
}

function Download(reqObject) {
	var _this = this;
	// validate that is has a download URL
	if(!reqObject.downloadURL){
		console.error('Download Object requires downloadURL');
	}
	
	// Initialize events
	EventEmitter.call(this);
	
	this.status = null;
	this.downloadURL = reqObject.downloadURL;
	this.songMetadata = reqObject.songMetadata;
	this.downloaders = [];
	this.writers = [new DefaultWriter()];
	
	this.on('DOWNLOADING', function (downloadRequest) {
		console.log('Download emitted DOWNLOADING');
		_this.writers.forEach(function (writerObj) {
			writerObj.start(downloadRequest);
		});
	});
}

util.inherits(Download, EventEmitter);

Download.prototype.autoStart = function () {
	for(var name in availableDownloaders){
		this.startNewDownloader(availableDownloaders[name]);
	}
	return this;
};

Download.prototype.startNewDownloader = function (downloaderClass) {
	var _this = this;
	var newDownloader = new downloaderClass(this.downloadURL);
	newDownloader.start();
	
	// set status to loading
	if(!this.status){
		this.status = 'LOADING';
	}
	
	newDownloader.on('READY', function (downloadLink) {
		// only emit the 'READY' event once
		if(this.status != 'READY'){
			_this.emit('READY');
		}
		_this.status = 'READY';
	});
	
	newDownloader.on('ERROR', function (errResp) {});
	
	newDownloader.on('DOWNLOADING', function (downloadRequest) {
		_this.emit('DOWNLOADING', downloadRequest);
	});
	
	this.downloaders.push(newDownloader);
	return this;
};

Download.prototype.addWriter = function (WriterObject) {
	this.writers.push(WriterObject);
	return this;
};

module.exports = Download;