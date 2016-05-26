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

		$urlRouterProvider.otherwise('/currentPage');

		$stateProvider
			.state('currentPage', {
				url:'/currentPage',
				templateUrl: 'views/download/current.view.html',
				controller: 'currentCtrl'
			})
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
				templateUrl:'views/status/inProgress.view.html'
			})
			.state('failed',{
				url:'/failed',
				templateUrl:'views/status/failed.view.html'
			})
		/*
			.state('dashboard.blank',{
				templateUrl:'views/pages/blank.html',
				url:'/blank'
			})
			.state('login',{
				templateUrl:'views/pages/login.html',
				url:'/login'
			})
			.state('dashboard.chart',{
				templateUrl:'views/chart.html',
				url:'/chart',
				controller:'ChartCtrl'
			})
			.state('dashboard.table',{
				templateUrl:'views/table.html',
				url:'/table'
			})
			.state('dashboard.panels-wells',{
					templateUrl:'views/ui-elements/panels-wells.html',
					url:'/panels-wells'
			})
			.state('dashboard.buttons',{
				templateUrl:'views/ui-elements/buttons.html',
				url:'/buttons'
			})
			.state('dashboard.notifications',{
				templateUrl:'views/ui-elements/notifications.html',
				url:'/notifications'
			})
			.state('dashboard.typography',{
				templateUrl:'views/ui-elements/typography.html',
				url:'/typography'
			})
			.state('dashboard.icons',{
				templateUrl:'views/ui-elements/icons.html',
				url:'/icons'
			})
			.state('dashboard.grid',{
				templateUrl:'views/ui-elements/grid.html',
				url:'/grid'
			});
		*/
}]);
