angular.module('music-downloader')
	.service('songOperations', ['$log', "$rootScope", "$q", "downloadService", "pouchDB", function ($log, $rootScope, $q, downloadService, pouchDB) {
		
		function changeStatus (destinationStatus, song) {
			song.status = destinationStatus;
			pouchDB.updateSong(song);
		}
		
		function toggleDetails(song) {
			song.details = !song.details;
		}
		
		function downloadManually(song) {
			downloadService.sendDownloadRequest(song, function () {});
		}
		
		function retry(song) {
			// build download request object
			var downloadObj = {
				downloadURL : song.downloadURL,
				songMetadata : song.songMetadata
			};
			
			downloadService.sendDownloadRequest(downloadObj, function (err, resp) {
				if(!err){
					//console.log(resp);
				}
			});
		}
		
		function openMenu($mdOpenMenu, ev) {
			originatorEv = ev;
			$mdOpenMenu(ev);
		}
		
		function openSong(song) {
			window.open(song.downloadURL);
		}
		
		function deleteSong(song) {
			pouchDB.db.remove(song);
		}
		
		var menuItems = [{
			text : 'Retry',
			click : retry,
			icon : 'replay'
		}, {
			text : 'Archive',
			click : changeStatus.bind(null, 'archived'),
			icon : 'archive'
		}, {
			text : 'Settings',
			click : null,
			icon : 'settings'
		}, {
			text : 'Delete',
			click : deleteSong,
			icon : 'delete'
		}];
		
		return {
			changeStatus : changeStatus,
			toggleDetails : toggleDetails,
			retry : retry,
			openMenu : openMenu,
			openSong : openSong,
			downloadManually : downloadManually,
			_items : menuItems
		};
	}]);