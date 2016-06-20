angular.module('music-downloader')
	.controller('completedCtrl', ['$scope', 'downloadService', 'songOperations', function($scope, downloadService, songOperations) {
		var self = this;
		self.songs = pouchDB.data.completed;
		
		$scope.ops = songOperations;
		
		$scope.toggleDetails = function(song) {
			song.details = !song.details;
		};
		
		
		
	}]);