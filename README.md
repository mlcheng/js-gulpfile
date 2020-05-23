# js-gulpfile

## This is DEPRECATED. Please use Ceres instead.

Using this gulpfile, you can easily build your front-end projects.*

\**As long as you agree with my development conventions.*

## Tasks
The following tasks are available for use in the gulpfile.

### `gulp help`
Displays simple documentation for the gulpfile.

### `gulp clean`
Removes all files built with `gulp build`. This includes:

1. Files containing `*.min.*`
2. JavaScript files ending in `*.mod.js`

### `gulp minify-js`
Minify and bundle all JavaScript files that are children or descendants of your working directory. The files will go through the following two pipelines.

#### 1. Minify
Minified files pass through the following pipeline:

1. `brfs` transform
2. Babel's `es2015` preset
3. `uglify`
4. Exported to `${filename}.min.js`

#### 2. Bundle
Bundled files pass through the following pipeline:

1. `brfs` transform
2. Babel's `es2015` preset
3. `uglify`
4. Exported to `${filename}.mod.js`

##### Exposed `require()`
The `require()` function is exposed in the bundled file as `window.require()`.

##### Exposed module name
The module itself is exposed as `iqwerty-${filename}`. Hey, what did I say about agreeing with my conventions?

##### The `_bundles.json` file
If you are bundling all your JavaScript files into one (or more) main files, specify them in a `_bundles.json` file in your working root.

```json
[
	"assets/js/bundle.js"
]
```

This ensures that only that file will pass through the bundle pipeline. In other words, the specified files will be the only ones with the `.mod.js` suffix.

### `gulp minify-css`
All CSS files that are children or descendants of your working directory will be passed to the following pipeline:

1. `autoprefixer`
2. `nano`
3. Exported to `${filename}.min.css`

### `gulp php-deps`
This is a task that you most certainly won't need if you're not me. This gulp task has two steps.

1. Find the `_phpdeps.json` file where PHP dependencies are specified.
2. Navigate to the development root and find the `/playground/lib-php/` folder and copy the dependencies into the specified destination

The `_phpdeps.json` file has the following structure:

```json
{
	"HttpRequest": "lib/php/"
}
```

The task will find the `HttpRequest.php` file and copy that to the destination.

### `gulp test`
You must have [`Quantum.js`](https://github.com/mlcheng/js-quantum) or the [iQwerty testing framework](https://github.com/mlcheng/js-test). Place test files inside a `tests/` directory placed in your working root. `inject()` or `require()` the files to test. Read the docs for more details if you're stuck.

### `gulp build`
Running this task will run the following tasks:

1. `minify-js`
2. `minify-css`
3. `php-deps`

After everything has completed:

1. `test`

That concludes the build process.

**Tip**: You can run `gulp clean build` for a clean build ;)

### `gulp watch`
A tiny LiveReload server will be started on port **35729**. The following file types will be watched for changes:

1. PHP
2. HTML

The following file types will be built and then reloaded

1. JavaScript
2. CSS

Remember to put the following script on your page to listen for LiveReload pushes!

```javascript
<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
```

### `gulp local`
Obviously this gulpfile isn't a catch-all for all use cases. If your project needs a few tasks that aren't provided here, specify them in your own `_gulpfile.js` in your working root. Then

```bash
gulp local --run ${task}
```

And you're done!
