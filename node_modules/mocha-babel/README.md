# Mocha Babel

A simple plugin for [Mocha](https://visionmedia.github.io/mocha/) to pass JS files through the [Babel](http://babeljs.io/) compiler. Note that dependencies of your project (i.e., files that include `node_modules` in their file path) will not be transpiled.

Babel is intentionally not included in this package so you can install your preferred version alongside Mocha Babel. Mocha Babel expects both babel and babel-runtime modules to exist in your project.

Use with Mocha from the command line like so:

    mocha --compilers js:mocha-babel my_test_dir/*.js
