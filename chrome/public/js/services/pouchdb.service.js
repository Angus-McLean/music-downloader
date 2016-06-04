angular.module('music-downloader')
	.service('pouchDB', ['$log', "$rootScope", "$q", function ($log, $rootScope, $q) {
		
		// initialize the local db
		var db = PouchDB('downloadsDB');
		
		var data = loadInitialData();
		
		var sync = PouchDB.sync('downloadsDB', 'http://localhost:3001/downloadsDB', {
			live: true,
			retry: true
		})
		.on('change', processChangeEvent)
		.on('complete', function (info) {
			console.log('PouchDB complete', info);
		})
		.on('error', function (err) {
			//$log.error('PouchDB Sync Error', err);
		}).catch(function (err2) {
			$log.error('PouchDB Sync Error', err2);
		});
		
		function processChangeEvent(resp) {
			var change = resp.change;
			$log.info('PouchDB change event', change);
			if(!change.deleted) {
				
				change.docs.forEach(function (doc) {
					
					//copy over the angularStateVariables if the doc exists
					doc._a = (data.all[doc._id] && data.all[doc._id]._a) || {};
					
					// delete from existing statuses
					delete data.loading[doc._id];
					delete data.completed[doc._id];
					delete data.failed[doc._id];
					
					// add to newly updated status
					data[doc.status][doc._id] = doc;
					data.all[doc._id] = doc;
				});
				
				$rootScope.$broadcast("pouchDB:change", change);
				$rootScope.$digest();
			} else {
				delete data.all[change.doc._id];
				delete data.loading[change.doc._id];
				delete data.completed[change.doc._id];
				delete data.failed[change.doc._id];
				$rootScope.$broadcast("pouchDB:delete", change);
				$rootScope.$digest();
			}
		}
		
		function loadInitialData() {
			var data = {
				all : {},
				loading : {},
				failed : {},
				completed : {}
			};
			['loading', 'failed', 'completed'].forEach(function (statusName) {
				getByStatus(statusName).then(function (res) {
					// iterate search results
					(res.rows || []).forEach(function (row) {
						data.all[row.id] = row.doc;
						data[statusName][row.id] = row.doc;
					});
				});
			});
			return data;
		}
		
		function getByStatus(queriedStatus) {
			return db.query(function (doc, emit) {
				emit(doc.status);
			}, {key: queriedStatus, include_docs : true}).catch(function (err) {
				$log.error('PouchDB Query Error', err);
			});
		}
		
		function by_id(prev, cur) {
			prev[cur[_id]] = cur;
			return prev;
		}
		
		var returnObj = {
			db : db,
			data : data
		};
		window.pouchDB = returnObj;
		return returnObj;
	}]);