export default {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.js', '!src/tests/**', '!src/index.js',],
    coverageReporters: ['text', 'lcov'],
};
