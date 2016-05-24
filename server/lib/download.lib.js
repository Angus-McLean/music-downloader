// download.lib.js

var request = require('request'),
	async = require('async'),
	querystring = require('querystring'),
	fs = require('fs'),
	constants = require(__dirname + '.\\..\\config\\constants.js');

module.exports.downloadLinks = function (downloadJobArr) {
	
	async.mapLimit(downloadJobArr, constants.vubey.parallelPages, function (downloadJobObj, callback_outer) {

		async.waterfall([
			function (callback) {
				postAndGetVubeyId(downloadJobObj, callback);
			},
			checkFinised
		]);
	}, function collector (err, res) {
		console.log('collected vubey download results : ', arguments);
	});
};


function postAndGetVubeyId (downloadJobObj, callback) {
	
	var formObj = {
		videoURL : downloadJobObj.downloadURL,
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
		
		var res_arr = body.match(/<meta http\-equiv\=\"refresh\" content=\"10; url=\/\?download=([A-z0-9]{32})\">/);

		console.log('got following vubey url : ', res_arr[1]);

		if(Array.isArray(res_arr)){
			
			var vubeyUrl = 'https://vubey.yt/?download='+res_arr[1];
			callback(null, vubeyUrl);

		} else {
			console.error('couldn\'t parse out vubey download id');
			callback(true, res);
		}

	});
}

function checkFinised (vubeyLoadPageLink, page_callback) {
	
	// load page
	request(vubeyLoadPageLink, function (err, res, body) {
		var pageObj = parseVubeyPage(body);

		if(pageObj.status == 'loading'){
			
			setTimeout(function () {
				checkFinised(vubeyLoadPageLink, page_callback);
			}, constants.vubey.waitBeforeRefresh);

		} else if(pageObj.status == 'finished'){
			console.log('Finished : ', pageObj);
			parseAndExecuteDownload(pageObj.link, page_callback);
		} else if(pageObj.status == 'failed'){
			console.log('Failed : ', pageObj);
			page_callback('vubey responded with an error', res);
		} else {
			console.error('unrecognized status', res, pageObj);
			page_callback('undetermined vubey page status', res);
		}
	});
}

function parseVubeyPage (bodyStr) {
	
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

function parseAndExecuteDownload (downloadLink, page_callback) {
	var youtubeName = downloadLink.match(/\.com\/(.*)\.mp3/)[1];
	youtubeName = youtubeName.replace(/_/g,' ');
	//youtubeName = youtubeName.replace(/\./g,'');
	youtubeName = youtubeName.replace(/\-Vubey/g,'');
	youtubeName += '.mp3';
	
	var folderPath = (constants.filesystem.absoluteDestinationFolder || constants.filesystem.relativeDestinationFolder);
	var songPath = folderPath + youtubeName;
	if(!fs.existsSync(folderPath)){
		fs.mkdirSync(folderPath);
	}
	request(downloadLink).pipe(fs.createWriteStream(songPath), function (err, writeData) {
		if(!err){
			console.log('Successfully Downloaded : '+youtubeName);
			page_callback(null, songPath);
		} else {
			console.error('write file error', err, writeData);
		}
	});
}