/***********************************************

  "index.js"

  Created by Michael Cheng on 01/06/2016 21:34
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require */

// Vendor modules
const gulp = require('gulp');
const path = require('path');


// Dev modules
const C = require('./modules/constants');
const clean = require('./modules/clean');
const lrServer = require('./modules/lrServer')();
const local = require('./modules/local');
const minJS = require('./modules/minJS');
const minCSS = require('./modules/minCSS');
const phpDeps = require('./modules/phpDeps');
const test = require('./modules/test');


const TASKS = [
	{
		'default': help,
		'description': 'Alias for help'
	},
	{
		'help': help,
		'description': 'Shows how to use this gulpfile.'
	},
	{
		'clean': clean,
		'description': 'Remove built files (.min, .mod)'
	},
	{
		'build': build,
		'description': 'Copy PHP dependencies to destination target, then minify JavaScript and CSS files.',
		'dependencies': ['minify-js', 'minify-css', 'php-deps']
	},
	{
		'test': test,
		'description': 'Run tests in the tests/ folder.'
	},
	{
		'minify-js': minifyJS,
		'description': 'Minify JavaScript files. Files are suffixed with ".min".'
	},
	{
		'minify-css': minifyCSS,
		'description': 'Minify CSS files. Files are suffixed with ".min".'
	},
	{
		'php-deps': phpDeps,
		'description': 'Copies PHP dependencies to the specified destination path. Use a "_phpdeps.json" file to specify dependencies.'
	},
	{
		'watch': watch,
		'description': 'Build the application. Then start a LiveReload server and watch files for changes. When changes are made, the page in the browser is reloaded automatically.',
		'dependencies': ['build']
	},
	{
		'local': local,
		'description': 'Runs a local gulp task located inside a "_gulpfile.js". Use "gulp local --run task" to run.'
	}
];
const getTaskName = taskObject => Object.keys(taskObject)
	.find(_task => _task !== 'description' && _task !== 'dependencies');
TASKS.forEach(task => {
	const taskName = getTaskName(task);
	gulp.task(taskName, task.dependencies, task[taskName]);
});



// Tasks below

function help() {
	TASKS.forEach(task => {
		const taskName = getTaskName(task);
		console.log(`\`gulp ${taskName}\`\n\n${task.description}\n\n\tDependencies: ${task.dependencies || '-none-'}\n\n-------------\n`);
	});
}

function build(done) {
	console.log('Finished build');
	done();

	// Run tests after everything is complete
	test();
}

function minifyJS() {
	return minJS(C.JS_FILES);
}

function minifyCSS() {
	return minCSS(C.CSS_FILES);
}

function watch() {
	console.log(`Starting LiveReload server on port ${C.LR_PORT}...`);
	lrServer.start();

	gulp.watch([...C.JS_FILES], _minify);
	gulp.watch([...C.CSS_FILES], _minify);
	gulp.watch([...C.MINIFIED_FILES, ...C.BUNDLED_FILES, ...C.HTML_FILES, ...C.PHP_FILES], _reload);

	function _minify(e) {
		const filename = e.path;
		const filetype = path.parse(filename).ext.replace('.', '');
		if(filetype === C.FileType.JS) {
			minJS(filename);
		} else if(filetype === C.FileType.CSS) {
			minCSS(filename);
		}
	}

	function _reload(e) {
		lrServer.reload(e.path);
	}
}