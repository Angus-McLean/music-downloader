angular.module('music-downloader')
	.controller('failedCtrl', ['$scope', 'downloadService', 'songOperations', function($scope, downloadService, songOperations) {
		var self = this;
		self.songs = pouchDB.data.failed;
		
		$scope.ops = songOperations;
		
		$scope.toggleDetails = function(song) {
			song.details = !song.details;
		};
		
	}]);