// youtube libraries

var request = require('request'),
	async = require('async');

//var SEARCH_DELAY = constants.youtube.searchConcurrency / (constants.youtube.secondsQuota / constants.youtube.searchCost) + constants.youtube.millisecondsOffset;
var SEARCH_DELAY = 5 / (3000 / 100) + 100;

// takes string, executes query on youtube with the string
module.exports.executeQuery = function executeYoutubeQuery (sessionObj, queryStr, callback) {

	var enc_queryStr = encodeURIComponent(queryStr).replace(/\+/g, '%2B').replace(/\%20/g, '+');

	var queryUrl = 'https://www.googleapis.com/youtube/v3/search?key=' + sessionObj.youtube.token + '&part=snippet&order=relevance&type=video&videoDefinition=high&q=' + enc_queryStr;

	console.log('Sending : ' + queryUrl);

	request({url : queryUrl}, function (err, response, body) {
		if (!err && response.statusCode == 200) {
			console.log('Got youtube search back for ' + decodeURIComponent(queryStr));
			var bodyObj = JSON.parse(body);

			// call callback only after delay to avoid quota problems
			setTimeout(function () {
				callback(null, bodyObj);
			}, SEARCH_DELAY);
		} else {
			console.log('error calling to youtube', arguments);
		}
	});
}

// Seach for a Spotify song on youtube
module.exports.buildYoutubeQuery = function buildYoutubeQuery (trackObj) {
	var queryStr = '';
	trackObj.track.artists.forEach(function (artistsObj) {
		queryStr += artistsObj.name + ' '
	});
	queryStr += '- '+trackObj.track.name;
	return queryStr;
}

// get the user's playlists
module.exports.getUserPlaylists = function getUserPlaylists (userid, apiToken, callback) {
	
	var options = {
		url : 'https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&key='+apiToken,
		// headers: {
		// 	'Authorization': 'Authorization: Bearer '+apiToken
		// }
	}
	request(options, function (error, response, body) {
		
		// validate json response
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			callback(null, data);
		
		} else {
		
			console.error('\nerror : ', error, '\nresponse : ', response, '\nbody : ', body);
			callback(response.statusCode, response);
		
		}
	});
}

// get videos in a playlist
module.exports.getPlaylistSongs = function getPlaylistSongs (playlistId, apiToken, callback) {
	
	var options = {
		url : 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId='+playlistId+'&key={YOUR_API_KEY}'+apiToken,
		// headers: {
		// 	'Authorization': 'Authorization: Bearer '+apiToken
		// }
	}
	request(options, function (error, response, body) {
		
		// validate json response
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);

			data.items.forEach(function (playListItem) {
				playListItem.videoUrl = buildYoutubeUrl(playListItem.snippet.resourceId.videoId);
			});

			callback(null, data);
		
		} else {
		
			console.error('\nerror : ', error, '\nresponse : ', response, '\nbody : ', body);
			callback(response.statusCode, response);
		
		}
	});
}

function buildYoutubeUrl (videoId) {
	return 'https://www.youtube.com/watch?v='+videoId;
}