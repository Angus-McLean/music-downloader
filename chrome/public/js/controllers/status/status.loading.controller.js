angular.module('music-downloader')
	.controller('loadingCtrl', ['$scope', 'downloadService', 'pouchDB', 'songOperations', function($scope, downloadService, pouchDB, songOperations) {
		var self = this;
		self.songs = pouchDB.data.loading;
		
		$scope.ops = songOperations;
		
		$scope.toggleDetails = function(song) {
			if(!song._a) {
				song._a = {};
			}
			song._a.details = !song._a.details;
		};
		
		$scope.toggleEdit = function (song) {
			if(!song._a) {
				song._a = {};
			}
			if(song._a.editing) {
				parseSongDescription(song);
				$scope.update(song);
			}
			song._a.editing = !song._a.editing;
		};
		
		$scope.ngModelOptions = {
			debounce : 1000
		};
		
		$scope.update = pouchDB.updateSong;
		
		function parseSongDescription (song) {
			console.log(arguments);
			var parsedDesc = /^((?!-).*)-((?!-).*)$/.exec(song._a.desc);
			if(parsedDesc && parsedDesc.length) {
				song.songMetadata.artist = parsedDesc[1].replace(/[ ]?$/, '');
				song.songMetadata.title = parsedDesc[2].replace(/^[ ]?/, '');
			}
		}
		
	}]);