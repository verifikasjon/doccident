module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    collectCoverageFrom: ['src/**/*.{ts,js}'],
    coverageThreshold: {
        global: {
            branches: 68,
            functions: 69,
            lines: 72,
            statements: 70,
        },
    },
}; 