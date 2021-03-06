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


/**
 * Change the working directory
 * @param  {String} to The directory to change to
 */
function chdir(to) {
	process.chdir(to);
}

/**
 * Notifies the user that the file has completed.
 * @param  {Object} files  Files that have completed
 */
function notify(files) {
	if(typeof files !== 'string') {
		globule.find(files, {
			srcBase: C.Dir.LOCAL,
			prefixBase: true
		}).forEach(file => console.log(`Finished ${file}`));
	} else {
		console.log(`Finished ${files}`);
	}
}

module.exports = {
	chdir,
	notify
};