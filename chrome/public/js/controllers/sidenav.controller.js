angular.module('music-downloader')
	.controller('sidenavCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
		$scope.showMobileMainHeader = true;
		$scope.openSideNavPanel = function() {
			$mdSidenav('left').open();
		};
		$scope.closeSideNavPanel = function() {
			$mdSidenav('left').close();
		};
	}]);