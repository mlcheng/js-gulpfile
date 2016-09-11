/***********************************************

  "constants.js"

  Created by Michael Cheng on 09/11/2016 09:53
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals module, process, __dirname */

const LR_PORT = 35729;
const LR_SERVER = 'http://localhost:' + LR_PORT;

const MINIFIED_FILES = ['./**/*.min.*'];
const BUNDLED_FILES = ['./**/*.mod.js'];
const JS_FILES = [
	'./**/*.js',
	'!./**/*.min.js',
	'!./**/*.mod.js',
	'!./**/*gulpfile.js',
	'!./gulpfile.js/**/*.js',
	'!./**/tests/*.js'
];
const CSS_FILES = ['./**/*.css', '!./**/*.min.css'];
const HTML_FILES = ['./**/*.html'];
const PHP_FILES = ['./**/*.php'];

const PHP_DEPENDENCIES_FILE = '_phpdeps.json';
const LOCAL_GULP_FILE = '_gulpfile.js';
const BUNDLE_CONFIG_FILE = '_bundles.json';

const FileType = {
	JS: 'js',
	CSS: 'css'
};

const Naming = {
	MIN: '.min',
	BUNDLED: '.mod',
	LIB_PREFIX: 'iqwerty-'
};

const Events = {
	FINISH: 'finish',
	ERROR: 'error',
	FILE: 'file'
};

const Dir = {
	LOCAL: process.env.INIT_CWD, // Directory where gulp is initialized
	INIT: __dirname // Directory containing the gulpfile
};

module.exports = {
	LR_PORT,
	LR_SERVER,
	MINIFIED_FILES,
	BUNDLED_FILES,
	JS_FILES,
	CSS_FILES,
	HTML_FILES,
	PHP_FILES,
	PHP_DEPENDENCIES_FILE,
	LOCAL_GULP_FILE,
	BUNDLE_CONFIG_FILE,
	FileType,
	Naming,
	Events,
	Dir
};