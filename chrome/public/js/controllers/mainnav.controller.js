angular.module('music-downloader')
	.controller('mainNavCtrl', ['$scope', '$mdSidenav', '$state', function($scope, $mdSidenav, $state) {
		console.log('loaded mainNavCtrl');
		$scope.showMobileMainHeader = true;
		$scope.openSideNavPanel = function() {
			$mdSidenav('left').open();
		};
		$scope.closeSideNavPanel = function() {
			$mdSidenav('left').close();
		};
		$scope.$state = $state;
	}]);