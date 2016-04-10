// spotify libraries

var request = require('request'),
	async = require('async');

module.exports.getUserPlaylists = function getUserPlaylists (userid, apiToken, callback) {
	
	var options = {
		url : 'https://api.spotify.com/v1/users/'+userid+'/playlists?limit=50',
		headers: {
			'Authorization': 'Authorization: Bearer '+apiToken
		}
	}
	request(options, function (error, response, body) {
		
		// validate json response
		if (!error && response.statusCode == 200) {
			console.log('Got data back from spotify!');
			var data = JSON.parse(body);
			callback(null, data);
		
		} else {
		
			console.error('\nerror : ', error, '\nresponse : ', response, '\nbody : ', body);
			callback(response.statusCode, response);
		
		}
	});
}

// deletes large portions of track object
function cleanTrackObj (trackObj) {
	try{ delete trackObj.added_by;} catch(e) {}
	try{ delete trackObj.track.available_markets;} catch(e) {}
}

module.exports.addTracksToPlaylistObj = function addTracksToPlaylistObj (playlistObj, callback) {

	if(playlistObj.tracks.total > 100){
		console.warn('playlist ' + playlistObj.id + ' has more than 100 songs.. Only the first 100 will be processed. I\'ll be adding this functionality later.')
	}

	var options = {
		url : playlistObj.tracks.href,
		headers: {
			'Authorization': 'Authorization: Bearer ' + ses.spotify.token
		}
	}

	request(options, function (error, response, body) {
		
		// validate json response
		if (!error && response.statusCode == 200) {
			console.log('Got data back from spotify!');
			var data = JSON.parse(body);

			data.items.forEach(cleanTrackObj);

			playlistObj.tracks = data;

			callback(null, playlistObj);
		
		} else {
		
			console.error('\nerror : ', error, '\nresponse : ', response, '\nbody : ', body);
			callback(error, response);
		
		}
	});
}

// returns array of songs, given the tracksURL (from the playlist object)
module.exports.getTracksByTrackUrl = function getTracksByTrackUrl (sessionObj, tracksUrl, callback) {

	var options = {
		url : tracksUrl,
		headers: {
			'Authorization': 'Authorization: Bearer ' + sessionObj.spotify.token
		}
	}

	request(options, function (error, response, body) {
		
		// validate json response
		if (!error && response.statusCode == 200) {
			console.log('Got data back from spotify!');
			var data = JSON.parse(body);

			data.items.forEach(cleanTrackObj);

			callback(null, data.items);
		
		} else {
		
			console.error('\nerror : ', error, '\nresponse : ', response, '\nbody : ', body);
			callback(error, response);
		
		}
	});
}