angular.module('music-downloader')
	.service('pouchDB', ['$log', "$rootScope", "$q", function ($log, $rootScope, $q) {
		
		
		// initialize the local db
		var db = PouchDB('downloadsDB');
		var sync = PouchDB.sync('downloadsDB', 'http://localhost:3000/db/downloadsDB', {
			live: true,
			retry: true
		}).on('change', function (info) {
			if(!change.deleted) {
				$rootScope.$broadcast("pouchDB:change", change);
			} else {
				$rootScope.$broadcast("pouchDB:delete", change);
			}
		}).on('error', function (err) {
			$log.error('PouchDB Sync Error', err);
		});
		
		function getByStatus(queriedStatus) {
			return db.query(function (doc, emit) {
				emit(doc);
			}, {status: queriedStatus}).catch(function (err) {
				$log.error('PouchDB Query Error', err);
			});
		}
		
		
		return {
			db : db,
			getByStatus : getByStatus
		};
	}]);