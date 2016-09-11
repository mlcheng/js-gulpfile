/***********************************************

  "minJS.js"

  Created by Michael Cheng on 09/11/2016 09:50
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, module */

// Vendor modules
const babel = require('gulp-babel');
const brfs = require('gulp-brfs');
const browserify = require('browserify');
const debug = require('gulp-debug'); // jshint ignore: line
const fs = require('fs');
const globule = require('globule');
const gulp = require('gulp');
const merge = require('merge-stream');
const path = require('path');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');


// Dev modules
const C = require('./constants');
const util = require('./util');


module.exports = function(files, reload) {
	util.chdir(C.Dir.LOCAL);


	/*
	Get the bundled file from _bundles.json
	Bundle only the files specified if _bundles.json exists
	Otherwise, all JS files will be bundled into their own bundle
	 */
	try {
		const bundles = JSON.parse(fs.readFileSync(C.BUNDLE_CONFIG_FILE), 'utf8');
		bundles.forEach(bundle => {
			let b = globule.find(bundle, {
				srcBase: C.Dir.LOCAL,
				prefixBase: true
			});
			if(!b.length) {
				console.log(`Bundle ${bundle} doesn't exist. Check your _bundles.json file.`);
			} else {
				files = b.pop();
			}
		});
	} catch(e) {
		// No bundle
	}



	let stream = merge();

	globule.find(files, {
		srcBase: C.Dir.LOCAL,
		prefixBase: typeof files !== 'string'
	}).forEach(function(file) {
		const location = path.parse(file);
		const filename = location.name;
		const destination = `${location.dir}/${filename}${C.Naming.BUNDLED}.js`;
		stream.add(
			browserify(file, { externalRequireName: `window['require']` })
				.require(file, { expose: C.Naming.LIB_PREFIX + filename })
				.on(C.Events.FILE, () => util.chdir(C.Dir.LOCAL))
				.bundle()
				.pipe(source(destination))
				.pipe(streamify(brfs()))
				.pipe(streamify(babel().on(C.Events.ERROR, console.log)))
				.pipe(streamify(uglify()))
				.pipe(gulp.dest(''))
				.on(C.Events.FINISH, () => {
					util.notify(destination, reload);
				})
		);
	});


	stream.add(
		gulp
			.src(files, { base: './' })
			.pipe(brfs())
			.pipe(babel().on(C.Events.ERROR, console.log))
			.pipe(uglify())
			.pipe(rename({
				suffix: C.Naming.MIN
			}))
			.pipe(gulp.dest(''))
			.on(C.Events.FINISH, () => {
				util.notify(files, reload);
			})
	);

	return stream;
};