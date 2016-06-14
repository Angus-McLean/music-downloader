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
		
		$scope.update = function (song) {
			var saveObj = JSON.parse(JSON.stringify(song));
			delete saveObj._a;
			pouchDB.db.put(saveObj);
		};
		
		function parseSongDescription (song) {
			console.log(arguments);
			var parsedDesc = /^((?!-).*)-((?!-).*)$/.exec(song._a.desc);
			if(parsedDesc && parsedDesc.length) {
				song.songMetadata.artist = parsedDesc[1].replace(/[ ]?$/, '');
				song.songMetadata.title = parsedDesc[2].replace(/^[ ]?/, '');
			}
		}
		
	}]);