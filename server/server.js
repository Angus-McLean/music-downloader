// server.js

var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	spotify = require('./lib/spotify.js'),
	youtube = require('./lib/youtube.js'),
	downloader = require('./lib/download.lib.js')
	//ses = require('./config/sessiondata.js')

GLOBAL.io = io;



// middlewares  :
app.use(function (req, res, next) {
	console.log(req.method, req.url);
	next();
});

app.use(express.static(__dirname+'/sb-admin-angular/app'));

app.use('/bower_components', express.static(__dirname+'/sb-admin-angular/bower_components'))

app.use(bodyParser.json());

/*
routes :
	- update session data
	- getting playlists : 
		- playlists/spotify/{playlist_id}
		- playlists/youtube/{playlist_id}
	- downloading selected songs
		- POST : download/songs
*/


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

	var links_arr = req.body.links || req.data.links;
	if(links_arr && links_arr.length){
		downloader.downloadLinks(links_arr);
	}
	res.status(200).send('STARTED_DOWNLOAD');
});


app.listen(3000, function () {
	console.log('listening on port 3000');
});