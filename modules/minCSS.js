/***********************************************

  "minCSS.js"

  Created by Michael Cheng on 09/11/2016 10:07
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, module */

// Vendor modules
const autoprefixer = require('gulp-autoprefixer');
const debug = require('gulp-debug'); // jshint ignore: line
const gulp = require('gulp');
const nano = require('gulp-cssnano');
const rename = require('gulp-rename');


// Dev modules
const C = require('./constants');
const util = require('./util');


module.exports = function(files, reload) {
	util.chdir(C.Dir.LOCAL);

	return gulp
		.src(files, { base: './' })
		.pipe(autoprefixer())
		.pipe(nano())
		.pipe(rename({
			suffix: C.Naming.MIN
		}))
		.pipe(gulp.dest(''))
		.on(C.Events.FINISH, () => util.notify(files, reload));
};