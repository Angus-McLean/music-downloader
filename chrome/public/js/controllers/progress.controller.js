angular.module('music-downloader')
	.controller('progressCtrl', ['$scope', 'downloadService', function($scope, downloadService) {
		console.log('loaded progressCtrl');
		
		this.selectedMode = 'md-fling';
		this.isOpen = false;
	}]);