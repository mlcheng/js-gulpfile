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
const tinylr = require('tiny-lr')({ errorListener });


// Dev modules
const C = require('./constants');


/**
 * The queue of live reload events.
 */
const queue = [];

/**
 * The timer used to debounce the reloading events.
 */
let timer;

/**
 * The final port that is used for live reload. It is the default port if there are no conflicts.
 */
let port = C.LR_PORT;

/**
 * Returns a random number in the range [min, max].
 */
function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random port between 10000 and 50000.
 */
function getRandomPort() {
	return getRandomNumber(10000, 50000);
}

function startServer(port) {
	console.log(`Attempting to start live reload server on port ${port}...`);
	tinylr.listen(port, console.log.bind(console));
}

function errorListener(error) {
	if(error.code === 'EADDRINUSE') {
		port = getRandomPort();
		startServer(port);
	}
}

module.exports = () => {
	let shell = {};

	shell.start = () => {
		startServer(C.LR_PORT);
	};

	shell.reload = file => {
		console.log('\x1b[32;1m%s\x1b[0m', `Reloading ${file}`);
		request(`${C.LR_SERVER}/changed?files=${file}`);
	};

	shell.getPort = () => port;

	/**
	 * Queue files for reload. This debounces the reload process by only reloading if nothing has entered the queue in 1.2 seconds.
	 */
	shell.queueForReload = file => {
		console.log(`Queueing ${file} for reload...`);
		queue.push(file);

		if(timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			console.log('\nReloading files...');
			// Reload all files in queue.
			while(queue.length) {
				const f = queue.pop();
				shell.reload(f);
			}
		}, 1200);
	};

	return shell;
};