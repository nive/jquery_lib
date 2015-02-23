module.exports = function(config) {

    var pkg = require('./package.json');

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'vendor/jquery/jquery.js',
            'dist/jq-nive-' + pkg.version + '.js',
            'test/**/*.spec.js'
        ],
        reporters: ['dots'],
        autoWatch: false,
        singleRun: true,
        logLevel: config.LOG_INFO,
        browsers: ['PhantomJS']
    });
}
