// constants

module.exports = {
	spotify : {
		relativePath : 'generated/',
		playlistJsonName : 'spotifyplaylists.json',
		playlistTxtName : 'spotifyplaylists_summary.txt',
		listTracks : 'tracksByPlaylist.json',
		tracksJsonName : 'spotifytrackslists.json',
		linksJsonName : 'sourcelinks.json'
	},
	youtube : {
		searchConcurrency : 5,
		secondsQuota : 3000,
		searchCost : 100,
		millisecondsOffset : 100
	},
	vubey : {
		waitBeforeRefresh : 15000,
		parallelPages : 10
	},
	filesystem : {
		relativeDestinationFolder : 'songs/',
		absoluteDestinationFolder : 'C:\\Users\\ERP\ Guru\\Music\\DownloadedSongs\\',
		filenameConvention : '{{artist}} - {{title}}'
	},
	
};
