// main.background.js

(function () {
	console.log('main.background.js');

	// background code here...
	chrome.contextMenus.create({
		title: 'Download Link',
		contexts : ['link'],
		onclick: triggerFetchLink.bind(null, 'link-download')
	});
	
	chrome.contextMenus.create({
		title: 'Download Song',
		contexts : ['selection'],
		onclick: triggerFetchLink.bind(null, 'selection-download')
	});

	chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
		switch (msg.action) {
			case 'download/urls':
				sendDownloadRequest(msg.data);
				break;
			default:
				
		}
		
	});

	function sendDownloadRequest(downloadReqObj) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://localhost:3000/download/urls', true);
		var body = {
				links : [downloadReqObj]
			};
		xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(body));
	}

	function triggerFetchLink(action) {
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				action : action
			});
		});
	}

	function logOnLoad () {
		console.log('Download Request Status : ', this.status);
	}

})();