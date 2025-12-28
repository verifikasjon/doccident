module.exports = {
    require: {
        './math-utils': {
            sum: (a, b) => a + b
        },
        'lodash': {
            // Mock lodash
        },
        'jquery': function() { return {} },
        './index.js': {} // Mock for the config example
    },
    globals: {
        module: { exports: {} }
    }
};
