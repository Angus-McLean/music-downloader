angular.module('music-downloader')
	.service('downloadService', ['$http', '$log', function ($http, $log) {
		
		// load currently downloading songs
		
		function sendDownloadRequest(downloadReqObj, callback) {
			// validate requestObj
			if(!downloadReqObj.downloadURL) {
				$log.error('INVALID_PARAMS', 'sendDownloadRequest requires a downloadURL property');
				callback('INVALID_PARAMS - sendDownloadRequest requires a downloadURL property', null);
			}
			var req = {
				links : [downloadReqObj]
			};
			sendRPC('/download/urls', req, callback);
		}
		
		function sendRPC(action, params, callback) {
			
			var requestObj = {
				action : action,
				params : params
			};
			
			// arbitrary transport layer
			$http({
				method : 'POST',
				url : 'http://localhost:3000'+action,
				data : params
			}).then(function (resp) {
				callback(null, resp);
			}, function (resp) {
				callback(resp, null);
			});
		}
		
		return {
			sendDownloadRequest : sendDownloadRequest
		};
	}]);