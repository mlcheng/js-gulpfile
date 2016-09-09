/***********************************************

  "gulpfile.js"

  Created by Michael Cheng on 01/06/2016 21:34
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, process, __dirname */

const gulp = require('gulp');
const debug = require('gulp-debug'); // jshint ignore:line
const globule = require('globule');
const fs = require('fs');
const path = require('path');

const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');

const browserify = require('browserify');
const brfs = require('gulp-brfs');

const babel = require('gulp-babel');
const rename = require('gulp-rename');

const tinylr = require('tiny-lr')();
const request = require('request');
const exec = require('child_process').exec;

const uglify = require('gulp-uglify');
const nano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');



/**
 * Define gulp tasks and their usage/description/dependencies
 * e.g.
 * 
 * {
 * 	'taskName': task,
 * 	'description': 'This task is awesome',
 * 	'dependencies': dep
 * }
 */
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
		'build': build,
		'description': 'Copy PHP dependencies to destination target, then minify JavaScript and CSS files.'
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
		'phpdeps': phpDeps,
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


/**
 * Get the task name from the whole task object
 * @param  {Object} taskObject The task object as specified above
 * @return {String}            The name of the task
 */
const getTaskName = (taskObject) => Object.keys(taskObject).find(_task => _task !== 'description' && _task !== 'dependencies');


/**
 * Generate gulp tasks
 */
TASKS.forEach(taskObject => {
	const taskName = getTaskName(taskObject);
	gulp.task(taskName, taskObject.dependencies, taskObject[taskName]);
});



/**
 * Gulpfile constants
 */
const LR_PORT = 35729;
const LR_SERVER = 'http://localhost:' + LR_PORT;
const MINIFIED_FILES = ['./**/*.min.*'];
const JS_FILES = ['./**/*.js', '!./**/*.min.js', '!./**/*.mod.js', '!./**/*gulpfile.js', '!./**/tests/*.js'];
const CSS_FILES = ['./**/*.css', '!./**/*.min.css'];
const HTML_FILES = ['./**/*.html'];
const PHP_FILES = ['./**/*.php'];
const PHP_DEPENDENCIES_FILE = '_phpdeps.json';
const LOCAL_GULP_FILE = '_gulpfile.js';



//------------------------------------------------------------



const FileType = {
	JS: 'js',
	CSS: 'css'
};

/**
 * The finished event
 * @type {String}
 */
const FINISH = 'finish';

/**
 * The error event
 * @type {String}
 */
const ERROR = 'error';

/**
 * The minified suffix
 * @type {String}
 */
const MIN = '.min';

/**
 * The prefix for each module required
 * @type {String}
 */
const LIB_PREFIX = 'iqwerty-';

/**
 * The bundled suffix, for use with browserify
 * @type {String}
 */
const BUNDLED = '.mod';

/**
 * The directory where gulp is initialized
 * @type {String}
 */
const LOCAL = process.env.INIT_CWD;

/**
 * The directory containing the gulpfile
 * @type {String}
 */
const INITIAL = __dirname;

/**
 * Change the working directory to the directory where gulp is run
 */
function chdir(location) {
	console.log('\n<<Changing working directory to ' + location + '>>');
	process.chdir(location);
}

/**
 * Returns the containing folder of a file
 * @param  {String} file The absolute path of a file
 * @return {String}      The containing folder of the file
 */
function getContainingFolder(file) {
	return file.substring(0, file.lastIndexOf('\\'));
}



function help() {
	TASKS.forEach(taskObject => {
		const taskName = getTaskName(taskObject);
		console.log(`gulp ${taskName}\n${taskObject.description}\n\n-----------\n`);
	});
}



function build() {
	console.log('Building...');
	test();
	minifyJS();
	minifyCSS();
	phpDeps();
}



function test() {
	console.log('Running tests...');
	exec(`cd ${LOCAL}/tests && node .`, function(err, stdout) {
		if(err) {
			console.log('No tests available');
		}
		console.log(stdout);
	});
}



function _minify(files, type, reload) {
	reload = reload || false;
	if(typeof files === 'string') {
		chdir(getContainingFolder(files));
	} else {
		chdir(LOCAL);
	}
	switch(type) {
		case FileType.JS:
			_minifyJS(files, reload);
			break;
		case FileType.CSS:
			_minifyCSS(files, reload);
			break;
		default:
			break;
	}
}


function minifyJS() {
	_minify(JS_FILES, FileType.JS);
}

function _minifyJS(files, reload) {
	console.log('Minifying JavaScript files...\n', files);
	const _r = what => {
		if(reload) {
			notifyChange(what);
		}
	};

	// The bundled file
	globule.find(files).forEach(function(file) {
		const filename = path.parse(file).name;
		const destination = `${path.parse(file).dir}/${filename}${BUNDLED}.js`;
		browserify(file, { externalRequireName: `window['require']` })
			.require(file, { expose: LIB_PREFIX + filename })
			.bundle()
			.pipe(source(destination))
			.pipe(streamify(brfs()))
			.pipe(streamify(babel().on(ERROR, console.log)))
			.pipe(streamify(uglify()))
			.pipe(gulp.dest(''))
			.on(FINISH, () => _r(destination));
	});

	// The normal file
	gulp
		.src(files)
		.pipe(brfs())
		.pipe(babel().on(ERROR, console.log))
		.pipe(uglify())
		.pipe(rename({
			suffix: MIN
		}))
		.pipe(gulp.dest(''))
		.on(FINISH, () => _r(files));
}


function minifyCSS() {
	_minify(CSS_FILES, FileType.CSS);
}

function _minifyCSS(files, reload) {
	console.log('Minifying CSS files...\n', files);
	return gulp
		.src(files)
		.pipe(autoprefixer())
		.pipe(nano())
		.pipe(rename({
			suffix: MIN
		}))
		.pipe(gulp.dest('.'))
		.on(FINISH, function() {
			if(reload) {
				notifyChange(files);
			}
		});
}



function phpDeps() {
	chdir(LOCAL);

	try {
		fs.statSync(PHP_DEPENDENCIES_FILE);
	} catch(err) {
		return console.log('No PHP dependencies');
	}

	const _deps = JSON.parse(fs.readFileSync(PHP_DEPENDENCIES_FILE, 'utf8'));

	chdir(INITIAL);
	_deps.forEach(depObject => {
		const dependency = Object.keys(depObject);
		const destination = `${LOCAL}/${depObject[dependency]}`;
		console.log(`Adding dependency ${dependency}.php to ${destination}`);
		return gulp
			.src(`playground/lib-php/${dependency}/${dependency}.php`)
			.pipe(gulp.dest(destination));
	});
}



function watch() {
	console.log('Starting LiveReload server');
	chdir(LOCAL);
	startLiveReloadServer();


	gulp.watch([...JS_FILES, ...CSS_FILES], minifyReload);
	gulp.watch([...MINIFIED_FILES, ...HTML_FILES, ...PHP_FILES], reload);
}

function startLiveReloadServer() {
	tinylr.listen(LR_PORT, (error) => {
		if(error) return console.log(error);
	});
}

function minifyReload(_event) {
	const filename = _event.path;
	const filetype = filename.split('.').reverse()[0].toLowerCase();
	if(filetype === 'css' || filetype === 'js') {
		_minify(filename, filetype, true);
	}
}

function reload(_event) {
	notifyChange(_event.path);
}

function notifyChange(filename) {
	console.log('Reloading', filename);
	request(LR_SERVER + '/changed?files=' + filename);
}



function local() {
	const args = process.argv;
	if(args[3] !== '--run') return console.log('Use --run to run a local task');

	const cmd = args[4];
	if(!cmd) return console.log('No task was entered');

	exec(`cd ${LOCAL} && gulp --gulpfile ${LOCAL_GULP_FILE} ${cmd}`, function(err, stdout) {
		console.log(stdout);
	});
}