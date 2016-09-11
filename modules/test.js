/***********************************************

  "test.js"

  Created by Michael Cheng on 09/11/2016 11:07
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, module, process */

// Vendor modules
const exec = require('child_process').exec;


// Dev modules
const C = require('./constants');


module.exports = function() {
	console.log('Running tests...');
	exec(`cd ${C.Dir.LOCAL}/tests && node .`, function(err) {
		if(err) {
			return console.log('No tests available');
		}
	}).stdout.pipe(process.stdout);
};