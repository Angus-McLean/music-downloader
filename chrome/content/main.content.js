// main.content.js

(function () {
	console.log('main.content.js');

	var lastContextedElem;
	var lastSelection;
	var urlRegex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;

	document.addEventListener('contextmenu', function(ev) {
		console.log('contextmenu event', ev);
		lastContextedElem = ev.srcElement;
		lastSelection = window.getSelection().toString();
	}, false);

	// content code here...
	chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
		console.log('chrome.runtime.onMessage',arguments, lastContextedElem);
		switch(msg.action){
			case 'link-download' :
				sendLinkToDownload(lastContextedElem);
				break;
			case 'selection-download' :
				sendSelectionToDownload(lastContextedElem);
				break;
		}
	});

	function sendLinkToDownload(elem) {
		var hrefElem = attrUp(elem, 'href');
		if(hrefElem){
			var downloadURL = qualifyURL(hrefElem.href);
			var downloadReqObj = {
				downloadURL : downloadURL,
				songMetadata : {}
			};
			sendDownloadRequest(downloadURL);
		}
	}
	
	function sendSelectionToDownload(lastContextedElem) {		
		var downloadReqObj = {
			downloadURL : window.location.href,
			songMetadata : {}
		};
		
		var parsedDesc = /^((?!-).*)-((?!-).*)$/.exec(lastSelection);
		if(parsedDesc && parsedDesc.length) {
			downloadReqObj.songMetadata.artist = parsedDesc[1].replace(/[ ]?$/, '');
			downloadReqObj.songMetadata.title = parsedDesc[2].replace(/^[ ]?/, '');
		}
		
		sendDownloadRequest(downloadReqObj);
	}

	function attrUp(elem, attrName){
		if(elem[attrName]) return elem;
		while(!elem.parentElement[attrName] && (elem = elem.parentElement)){}
		return elem && elem.parentElement;
	}
	
	function qualifyURL(url){
		var img = document.createElement('img');
		img.src = url; // set string url
		url = img.src; // get qualified url
		img.src = null; // no server request
		return url;
	}
	
	function sendDownloadRequest(downloadReqObj) {
		chrome.runtime.sendMessage({
			action : 'download/urls',
			data : downloadReqObj
		}, function () {});
	}

})();