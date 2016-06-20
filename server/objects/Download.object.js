// Download.object.js
var path = require('path'),
	DefaultWriter = require(path.join(__base, 'writers', 'default.writer.js'));

var EventEmitter = require('events').EventEmitter,
	util = require('util');
	
var availableDownloaders = {
	vubey : require(path.join(__base, 'downloaders', 'vubey.downloader.js'))
};

var availableWriters = {
	default : require(path.join(__base, 'writers', 'default.writer.js'))
}

function Download(reqObject) {
	var _this = this;
	// validate that is has a download URL
	if(!reqObject.downloadURL){
		console.error('Download Object requires downloadURL');
	}
	
	// Initialize events
	EventEmitter.call(this);
	GLOBAL.downloadsDBEvents.on(reqObject.downloadURL + ':change', function (doc) {
		_this.doc = doc;
	});

	this.doc = {
		_id : reqObject.downloadURL,
		status : 'loading',
		downloadURL : reqObject.downloadURL,
		songMetadata : reqObject.songMetadata,
		date : {
			start : new Date()
		}
	};

	this._id = reqObject.downloadURL;
	this.status = 'loading';
	this.downloadURL = reqObject.downloadURL;
	this.songMetadata = reqObject.songMetadata;
	this.downloaders = [];
	
	var defaultWriter = new DefaultWriter(this);
	defaultWriter.on('DONE', function () {
		_this.status = 'completed';
		_this.doc.status = 'completed';
		_this.pushToDB.call(_this);
	});
	defaultWriter.on('ERROR', function () {
		_this.status = 'failed';
		_this.doc.status = 'failed';
		_this.pushToDB.call(_this);
	});
	this.writers = [defaultWriter];
	
	this.on('DOWNLOADING', function (downloadRequest) {
		console.log('Download emitted DOWNLOADING');
		_this.writers.forEach(function (writerObj) {
			writerObj.start(downloadRequest);
		});
	});
	
	this.pushToDB.call(this);
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
	var newDownloader = new downloaderClass(_this.downloadURL);
	newDownloader.start();
	
	// set status to loading
	if(!_this.status){
		_this.status = 'loading';
		_this.doc.status = 'loading';
	}
	
	newDownloader.on('READY', function (downloadLink) {
		// only emit the 'READY' event once
		if(this.status != 'READY'){
			_this.emit('READY');
		}
		_this.status = 'READY';
		_this.doc.status = 'READY';
	});
	
	newDownloader.on('ERROR', function (errResp) {
		_this.doc.status = 'failed';
		_this.pushToDB.call(_this);
	});
	
	newDownloader.on('FAILED', function (errResp) {
		_this.doc.status = 'failed';
		_this.pushToDB.call(_this);
	});
	
	newDownloader.on('DOWNLOADING', function (downloadRequest) {
		_this.emit('DOWNLOADING', downloadRequest);
	});
	
	this.downloaders.push(newDownloader);
	return this;
};

Download.prototype.pushToDB = function () {
	var _this = this;
	var db = GLOBAL.downloadsDB;
	var docToPush = _this.toDBObject();
	
	db.put(docToPush).then(function (doc) {
		_this.doc._rev = doc.rev;
	}).catch(function (err) {
		if (err.status === 409) {
			
			console.log('PouchDB conflict, resolving...');
			
			db.get(docToPush._id).then(function(latestDoc) {
				docToPush._rev = latestDoc._rev;
				_this.doc._rev = latestDoc._rev;
				return db.put(docToPush).catch(function (err) {
					console.error('PouchDB failed merge', err);
				});
			})
		} else {
			// some other error
			console.error('PouchDB Failed to save DownloadObject', arguments);
		}
	});
};

Download.prototype.toDBObject = function () {
	var self = this;
	// var propertiesToReturn = ['_id', 'status', 'downloadURL', 'songMetadata'];
	// return propertiesToReturn.reduce(function (dbObj, propName) {
	// 	dbObj[propName] = self[propName];
	// 	return dbObj;
	// }, {});
	return this.doc;
};

Download.prototype.addWriter = function (WriterObject) {
	this.writers.push(WriterObject);
	return this;
};

module.exports = Download;