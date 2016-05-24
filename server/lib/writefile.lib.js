// writefile.lib.js
/**
    Library for writing song data to filesystem.
    Handles song meta data
    Handles sorting songs in folder structure
*/

var fs = require('fs'),
    ffmetadata = require('ffmetadata');
    
    
module.exports.writeSong = function (readStream, songMetaData, options, callback) {
    // pipe song data to filesystem
    
    
    // once done writing song to disk, write meta data
}