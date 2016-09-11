/***********************************************

  "phpDeps.js"

  Created by Michael Cheng on 09/11/2016 10:25
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, module */

// Vendor modules
const debug = require('gulp-debug'); // jshint ignore: line
const fs = require('fs');
const gulp = require('gulp');
const merge = require('merge-stream');


// Dev modules
const C = require('./constants');
const util = require('./util');


module.exports = function() {
	util.chdir(C.Dir.LOCAL);

	let stream = merge();

	try {
		fs.statSync(C.PHP_DEPENDENCIES_FILE);
	} catch(e) {
		return console.log('No PHP dependencies');
	}

	const deps = JSON.parse(fs.readFileSync(C.PHP_DEPENDENCIES_FILE, 'utf8'));
	deps.forEach(dep => {
		const dependency = Object.keys(dep);
		const destination = `${C.Dir.LOCAL}/${dep[dependency]}`;
		stream.add(
			gulp
				.src(`${C.Dir.INIT}/../../playground/lib-php/${dependency}/${dependency}.php`)
				.pipe(gulp.dest(destination))
				.on(C.Events.FINISH, () => console.log(`Adding dependency ${dependency}.php to ${destination}`))
		);
	});

	return stream;
};