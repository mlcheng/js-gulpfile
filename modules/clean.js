/***********************************************

  "clean.js"

  Created by Michael Cheng on 09/11/2016 12:59
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, module */

// Vendor modules
const fs = require('fs');
const globule = require('globule');


// Dev modules
const C = require('./constants');
const util = require('./util');


module.exports = function() {
	util.chdir(C.Dir.LOCAL);
	
	globule.find([...C.MINIFIED_FILES, ...C.BUNDLED_FILES], {
		srcBase: C.Dir.LOCAL,
		prefixBase: true
	}).forEach(file => {
		fs.unlinkSync(file);
		console.log(`Removed ${file}`);
	});
};