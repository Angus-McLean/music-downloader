angular.module('music-downloader')
	.controller('archivedCtrl', ['$scope', 'downloadService', 'songOperations', 'pouchDB',function($scope, downloadService, songOperations, pouchDB) {
		var self = this;
		self.songs = pouchDB.data.archived;
		
		$scope.ops = songOperations;
		
		
	}]);