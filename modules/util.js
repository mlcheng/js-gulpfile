/***********************************************

  "util.js"

  Created by Michael Cheng on 09/11/2016 09:56
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, process, module */

// Vendor modules
const globule = require('globule');


// Dev modules
const C = require('./constants');
const lrServer = require('./lrServer')();


/**
 * Change the working directory
 * @param  {String} to The directory to change to
 */
function chdir(to) {
	//console.log(`\n> ${to}`);
	process.chdir(to);
}

/**
 * Notifies the user that the file has completed.
 * Notifies live-reload server if specified
 * @param  {Object} files  Files that have completed
 * @param  {Boolean} reload Whether or not to notify live-reload
 */
function notify(files, reload) {
	if(typeof files !== 'string') {
		globule.find(files, {
			srcBase: C.Dir.LOCAL,
			prefixBase: true
		}).forEach(file => console.log(`Finished ${file}`));
	} else {
		console.log(`Finished ${files}`);
	}

	// Notify live reload server if needed
	if(reload) {
		lrServer.reload(files);
	}
}

module.exports = {
	chdir,
	notify
};