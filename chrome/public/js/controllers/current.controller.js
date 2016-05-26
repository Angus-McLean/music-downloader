angular.module('music-downloader')
	.controller('currentCtrl', ['$scope', 'downloadService', function($scope, downloadService) {
		console.log('loaded currentCtrl');
		
		$scope.current = {};
		
		$scope.startDownload = function () {
			console.log('Triggered Start Download')
			chrome.tabs.query({
				active:true,
				lastFocusedWindow:true
			}, function (tabsArr) {
				console.log('recieved tabs : ', tabsArr)
				if(tabsArr.length == 1){
					// build download request object
					var downloadObj = $scope.current;
					downloadObj.downloadURL = tabsArr[0].url;
					
					downloadService.sendDownloadRequest(downloadObj, function (err, resp) {
						if(!err){
							console.log(resp);
						}
					});
				}
			});
		};
		

		
		
		
	}]);