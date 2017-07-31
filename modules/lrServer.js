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


const queue = [];
let timer;

module.exports = () => {
	let shell = {};

	shell.start = () => {
		tinylr.listen(C.LR_PORT, console.log);
	};

	shell.reload = (file) => {
		console.log('\x1b[1;32;40m%s\x1b[0m', `Reloading ${file}`);
		request(`${C.LR_SERVER}/changed?files=${file}`);
	};

	/**
	 * Queue files for reload. This debounces the reload process by only reloading if nothing has entered the queue in 1.2 seconds.
	 */
	shell.queueForReload = (file) => {
		console.log(`Queueing ${file} for reload...`);
		queue.push(file);

		if(timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			console.log('\nReloading files...');
			// Reload all files in queue.
			while(true) {
				const f = queue.pop();
				shell.reload(f);
				if(!queue.length) {
					break;
				}
			}
		}, 1200);
	};

	return shell;
};