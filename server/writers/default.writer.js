// default.writer.js

var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	fs = require('fs'),
	request = require('request'),
	httpHelpers = require('./../lib/httpHelpers.js'),
	settings = require(__dirname + '.\\..\\config\\constants.js'),
	ffmetadata = require("ffmetadata");

process.env.FFMPEG_PATH = "C:\\Users\\ERP Guru\\Downloads\\ffmpeg-20160530-git-d74cc61-win32-static\\bin\\ffmpeg.exe";


function formatSongName(downloadLink) {
	var youtubeName = downloadLink.match(/\.com\/(.*)\.mp3/)[1];
	youtubeName = youtubeName.replace(/_/g,' ');
	//youtubeName = youtubeName.replace(/\./g,'');
	youtubeName = youtubeName.replace(/\-Vubey/g,'');
	youtubeName += '.mp3';
	
	var folderPath = (settings.filesystem.absoluteDestinationFolder || settings.filesystem.relativeDestinationFolder);
	var songPath = folderPath + youtubeName;
	if(!fs.existsSync(folderPath)){
		fs.mkdirSync(folderPath);
	}
	return songPath;
}
	
function DefaultWriter(config) {
	// Initialize events
	EventEmitter.call(this);
	
	this.songMetadata = (config && config.songMetadata) || {};
	
	this.status = 'WAITING';
}

util.inherits(DefaultWriter, EventEmitter);

DefaultWriter.prototype.start = function (downloadRequest) {
	var _this = this;
	var songPath = formatSongName(downloadRequest.uri.href);
	
	this.status = 'WRITING';
	this.emit('WRITING');
	
	var writeStream = fs.createWriteStream(songPath);
	
	writeStream.on('finish', function () {
		ffmetadata.write(songPath, _this.songMetadata, {"id3v2.3" : true}, function (err) {
			if(err) {
				console.error('Failed to Write song meta data', err);
			} else {
				console.log('Successfully wrote metadata', JSON.stringify(_this.songMetadata));
			}
		});
	});
	
	downloadRequest.pipe(writeStream, function (err, writeData) {
		if(!err){
			console.log('Successfully Downloaded : '+youtubeName);
			_this.emit('DONE');
		} else {
			console.error('write file error', err, writeData);
			_this.emit('ERROR', err);
		}
	});
};


module.exports = DefaultWriter;
