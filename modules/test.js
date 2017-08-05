/***********************************************

  "test.js"

  Created by Michael Cheng on 09/11/2016 11:07
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, module */

// Vendor modules
const exec = require('child_process').exec;
const fs = require('fs');


// Dev modules
const C = require('./constants');


/**
 * Normalizes a path to the local directory in which gulp was run.
 */
function _toLocal(relativePath) {
	return name => `${relativePath}/${name}`;
}

/**
 * Determines whether or not a label is a directory if it is not hidden.
 */
function _isDir(name) {
	const parts = name.split('/');
	return !/^\..*/.test(parts.pop()) && fs.lstatSync(name).isDirectory();
}

/**
 * Returns an array of directories for a given path.
 */
function _getDirectoriesFor(path) {
	return fs.readdirSync(path).map(_toLocal(path)).filter(_isDir);
}

/**
 * Recursively gives the full paths to subdirectories under the given path.
 */
function recursiveGetDirectoriesFor(path) {
	let stack = [path];
	let directories = [];
	while(stack.length) {
		let current = stack.pop();
		const subdirs = _getDirectoriesFor(current);
		stack = [...stack, ...subdirs];
		directories = [...directories, ...subdirs];
	}
	return directories;
}

function getTestDirectoriesFor(path) {
	const directories = recursiveGetDirectoriesFor(path);
	return directories.filter(directory => directory.split('/').pop() === 'tests');
}

module.exports = done => {
	console.log('Running tests...\n');
	// Find all `tests/` directories
	const testDirs = getTestDirectoriesFor(C.Dir.LOCAL);

	// Run all the tests
	const runTests = new Promise(resolve => {
		testDirs.forEach((testDir, idx) => {
			exec(`cd ${testDir} && node .`, (err, stdout) => {
				console.log(`Found tests for ${testDir}...`);
				console.log(stdout);
				if(err) {
					return console.log('No tests available');
				}
				if(idx === testDirs.length - 1) {
					resolve();
				}
			});
		});
	});

	// Notify that the task is done by calling the callback
	runTests.then(done);
};