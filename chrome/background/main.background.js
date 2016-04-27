// main.background.js

(function () {
	console.log('main.background.js');

	// background code here...
	chrome.browserAction.onClicked.addListener(function (tab) {
		//console.log('clicked browser action', arguments);
		//;

		var requestObj = {
			links : [tab.url]
		};

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://localhost:3000/download/urls');
		xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.onload = logOnLoad;
		xhr.send(JSON.stringify(requestObj));
	});

	function logOnLoad () {
		console.log('Download Request Status : ', this.status);
	}

})();