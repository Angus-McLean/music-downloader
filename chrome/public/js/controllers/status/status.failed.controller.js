angular.module('music-downloader')
	.controller('failedCtrl', ['$scope', 'downloadService', function($scope, downloadService) {
		var self = this;
		self.songs = pouchDB.data.failed;
		
		$scope.toggleDetails = function(song) {
			song.details = !song.details;
		};
	}]);