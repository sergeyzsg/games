require.config({
    baseUrl: '/static/js',
    paths: {
        jquery: 'lib/jquery-2.0.3',
        bootstrap: 'lib/bootstrap-3.0.3',
        underscore: 'lib/.bower/underscore/underscore'
    },
    shim: {
        bootstrap: ['jquery'],
        underscore: {exports: '_'}
    }
});