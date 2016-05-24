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

		$urlRouterProvider.otherwise('/download');

		$stateProvider
			.state('download', {
				url:'/download',
				templateUrl: 'views/download/current.view.html',
				controller: 'currentCtrl'
			});
		/*
			.state('download.current',{
				url:'/current',
				//controller: 'MainCtrl',
				templateUrl:'views/download/current.view.html'
			});
		
			.state('dashboard.form',{
				templateUrl:'views/form.html',
				url:'/form'
			})
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
