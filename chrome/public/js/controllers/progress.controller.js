angular.module('music-downloader')
	.controller('statusCtrl', ['$scope', 'downloadService', '$state', 'pouchDB', function($scope, downloadService, $state, pouchDB) {
		console.log('loaded statusCtrl');
		
		this.selectedMode = 'md-fling';
		this.isOpen = false;
		
		$scope.startDownload = function () {
			console.log('Triggered Start Download');
			chrome.tabs.query({
				active:true,
				lastFocusedWindow:true
			}, function (tabsArr) {
				if(tabsArr.length == 1){
					// build download request object
					var downloadObj = {
						downloadURL : tabsArr[0].url,
						songMetadata : {}
					};
					
					downloadService.sendDownloadRequest(downloadObj, function (err, resp) {
						if(!err){
							console.log(resp);
						}
					});
				}
			});
		};
		
		$scope.manualEntry = function () {
			var emptySong = {
				downloadURL : '',
				status : 'initialize',
				songMetadata : {},
				_a : {
					editing : true,
					details  :true
				}
			};
			pouchDB.data.loading[null] = emptySong;
		};
		
	}]);