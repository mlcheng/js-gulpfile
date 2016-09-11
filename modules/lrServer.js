/***********************************************

  "lrServer.js"

  Created by Michael Cheng on 09/11/2016 10:42
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, module */

// Vendor modules
const request = require('request');
const tinylr = require('tiny-lr')();


// Dev modules
const C = require('./constants');


module.exports = function() {
	let shell = {};

	shell.start = function() {
		tinylr.listen(C.LR_PORT, console.log);
	};

	shell.reload = function(file) {
		console.log(`Reloading ${file}`);
		request(`${C.LR_SERVER}/changed?files=${file}`);
	};

	return shell;
};