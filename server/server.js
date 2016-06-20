// server.js

GLOBAL.__base = __dirname;

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	app = express(),
	dbApp = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	spotify = require(path.join(__base, 'lib', 'spotify.js')),
	youtube = require(path.join(__base, 'lib', 'youtube.js')),
	downloader = require(path.join(__base, 'lib', 'download.lib.js')),
	Download = require(path.join(__base, 'objects', 'Download.object.js')),
	PouchDB = require('pouchdb'),
	EventEmitter = require('events');
	//ses = require('./config/sessiondata.js')

GLOBAL.io = io;
GLOBAL.memPouchDBConfig = PouchDB.defaults({db: require('memdown')});

// middlewares  :
app.use(function (req, res, next) {
	console.log(req.method, req.url);
	next();
});

dbApp.use(require('express-pouchdb')(GLOBAL.memPouchDBConfig));

GLOBAL.downloadsDB = new GLOBAL.memPouchDBConfig('downloadsDB');
GLOBAL.downloadsDBEvents = new EventEmitter();
GLOBAL.downloadsDB.changes({
	since: 'now',
	live: true,
	include_docs: true
}).on('change', function (change) {
	if (change.deleted) {
		// document was deleted
	} else {
		
		console.log(change.id+':change');
		downloadsDBEvents.emit(change.id+':change', change.doc);
	
	}
}).on('error', function (err) {
	// handle errors
});

// app.use(express.static(__dirname+'/sb-admin-angular/app'));
// 
// app.use('/bower_components', express.static(__dirname+'/sb-admin-angular/bower_components'))

app.use(bodyParser.json());

////// spotify Routes //////
app.get('/playlists/spotify/me', function (req, res) {
	spotify.getUserPlaylists(req.query.userid, req.query.apiToken, function (err, data) {
		if(!err){
			return res.send(data);
		}
	})
});

////// Youtube Routes //////
app.get('/playlists/youtube/me', function (req, res) {
	youtube.getUserPlaylists(req.query.userid, req.query.apiToken, function (err, data) {
		if(!err){
			return res.send(data);
		}
	})
});

app.get('/playlists/youtube/songs', function (req, res) {
	youtube.getPlaylistSongs(req.query.playlistId, req.query.apiToken, function (err, data) {
		if(!err){
			return res.send(data);
		}
	})
});

////// Download Routes //////

app.post('/download/urls', function (req, res) {

	var downloadsArr = (req.body && req.body.links) || (req.data && req.data.links) || null;
	
	if(downloadsArr && downloadsArr.length) {
		downloadsArr.forEach(function (linkObj) {
			var newDown = new Download(linkObj);
			newDown.autoStart();
		});
		res.status(200).send('SUCCESS');
	} else {
		res.status(400).send('MISSING_LINKS');
	}
});


app.listen(3000, function () {
	console.log('listening on port 3000');
});
dbApp.listen(3001, function () {
	console.log('listening on port 3001');
});
