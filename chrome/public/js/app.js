console.log('loaded app.js');
//angular.module('music-downloader', []);

angular
	.module('music-downloader', [
		'ui.router',
		'ngMaterial'
	])
	.config(function($mdThemingProvider) {
		$mdThemingProvider.theme('default').primaryPalette('orange').dark();
	})
	.config(['$stateProvider','$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {

		$urlRouterProvider.otherwise('/status');

		$stateProvider
			.state('playlist', {
				url:'/playlist',
				//controller: 'MainCtrl',
				templateUrl:'views/download/playlist.view.html'
			})
			.state('trackSearch',{
				url:'/trackSearch',
				templateUrl:'views/download/trackSearch.view.html'
			})
			.state('inProgress',{
				url:'/inProgress',
				templateUrl:'views/status/inProgress.view.html',
				controller: 'progressCtrl as demo'
			})
			.state('status',{
				url:'/status',
				templateUrl:'views/status/status.view.html',
				controller: 'statusCtrl as demo',
				redirectTo: 'status.loading'
			})
			.state('status.loading',{
				url:'/status/loading',
				controller: 'loadingCtrl as staCtrl',
				templateUrl:'views/status/status.loading.view.html'
			})
			.state('status.failed',{
				url:'/status/failed',
				controller: 'failedCtrl as staCtrl',
				templateUrl:'views/status/status.failed.view.html'
			})
			.state('status.completed',{
				url:'/status/completed',
				controller: 'completedCtrl as staCtrl',
				templateUrl:'views/status/status.completed.view.html'
			})
			.state('status.archived',{
				url:'/status/archived',
				controller: 'archivedCtrl as staCtrl',
				templateUrl:'views/status/status.archived.view.html'
			});
	}])
	.run(['$rootScope', '$state', 'pouchDB', function($rootScope, $state) {
		
		$rootScope.$on('$stateChangeStart', function(evt, to, params) {
			if (to.redirectTo) {
				evt.preventDefault();
				$state.go(to.redirectTo, params, {location: 'replace'});
			}
		});
	}]);
