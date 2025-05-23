#! /usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

const { version } = require('../package');
const doctest = require('..');
const program = require('commander');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const { pathToFileURL } = require('url');

const DEFAULT_GLOB = '**/*.+(md|markdown)';
const DEFAULT_IGNORE = [
    '**/node_modules/**',
    '**/bower_components/**'
];

// Config
const config = {
    require: {},
    globals: {},
    ignore: [],
    testOutput: false
};

// Setup commander
program
    .name('doccident')
    .description('Test all the code in your markdown docs!')
    .version(version, '-v, --version', 'output the current version')
    .helpOption('-h, --help', 'output usage informations')
    .option('-c, --config <path>', 'custom config location', path.join(process.cwd(), '/.doccident-setup.js'))
    .option('--test-output', 'output the test results to the console')
    .parse(process.argv);

// Parse config file
(async () => {
    if (program.config) {
        const configPath = path.resolve(program.config);

        if (fs.existsSync(configPath)) {
            try {
                const customConfig = await import(pathToFileURL(configPath).href);
                Object.assign(config, customConfig.default || customConfig);
            } catch (e) {
                console.error(`Cannot load config "${configPath}":`, e);
                process.exit(1);
            }
        }
    }

    if (program.testOutput) {
        config.testOutput = true;
    }

    // Resolve files
    glob(
        program.args[0] || DEFAULT_GLOB,
        {
            ignore: [...config.ignore, ...DEFAULT_IGNORE]
        },
        (err, files) => {

            if (err) {
                console.trace(err);
            }

            // Run tests
            const results = doctest.runTests(files, config);

            console.log('\n');
            doctest.printResults(results);

            // Exit with error-code if any test failed
            const failures = results.filter(result => result.status === 'fail');
            if (failures.length > 0) {
                process.exit(1);
            }
        }
    );
})();
