module.exports = function(config) {

    var pkg = require('./package.json');

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'vendor/jquery/dist/jquery.js',
            'dist/nive-jq-' + pkg.version + '.js',
            'test/test_*.js'
        ],
        reporters: ['dots'],
        autoWatch: false,
        singleRun: true,
        logLevel: config.LOG_INFO,
        browsers: ['PhantomJS']
    });
};
