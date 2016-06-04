angular.module('music-downloader')
	.controller('completedCtrl', ['$scope', 'downloadService', function($scope, downloadService) {
		var self = this;
		self.songs = pouchDB.data.completed;
		
		$scope.toggleDetails = function(song) {
			song.details = !song.details;
		};
	}]);