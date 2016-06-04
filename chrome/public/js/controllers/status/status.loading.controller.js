angular.module('music-downloader')
	.controller('loadingCtrl', ['$scope', 'downloadService', 'pouchDB', function($scope, downloadService, pouchDB) {
		var self = this;
		self.songs = pouchDB.data.loading;
		
		$scope.toggleDetails = function(song) {
			if(!song._a) {
				song._a = {};
			}
			song._a.details = !song._a.details;
		};
		
		$scope.ngModelOptions = {
			debounce : 1000
		};
		
		$scope.update = function (song) {
			var saveObj = JSON.parse(JSON.stringify(song));
			delete saveObj._a;
			pouchDB.db.put(saveObj);
		};
		
	}]);