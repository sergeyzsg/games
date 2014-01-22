require.config({
    baseUrl: '/static/js',
    paths: {
        jquery: 'lib/jquery-2.0.3',
        bootstrap: 'lib/bootstrap-3.0.3'
    },
    shim: {
        bootstrap: ['jquery']
    }
});