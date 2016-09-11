/***********************************************

  "local.js"

  Created by Michael Cheng on 09/11/2016 11:45
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
	const args = process.argv;
	if(args[3] !== '--run') return console.log('Use --run to run a local task');

	const cmd = args[4];
	if(!cmd) return console.log('No task was entered');

	exec(`cd ${C.Dir.LOCAL} && gulp --gulpfile ${C.LOCAL_GULP_FILE} ${cmd}`)
		.stdout.pipe(process.stdout);
};