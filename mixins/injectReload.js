/***********************************************

  "injectReload.js"

  Created by Michael Cheng on 09/16/2017 13:58
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, module */

// Vendor modules
const inject = require('gulp-inject-string');


module.exports = port => {
	console.log('Injecting livereload script...');
	return () => inject.append(`
		if(typeof document !== 'undefined' && !document.querySelector('script[data-livereload]')) {
			document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':${port}/livereload.js?snipver=1" async defer data-livereload></' + 'script>');
		}
	`);
};