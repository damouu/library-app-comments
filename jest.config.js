export default {
    preset: 'ts-jest/presets/default-esm',

    testEnvironment: 'node',

    collectCoverage: true,

    coverageDirectory: 'coverage',

    collectCoverageFrom: ['src/**/*.ts', '!src/tests/**', '!src/index.ts', '!src/instrumentation.ts',],

    coverageReporters: ['text', 'lcov',],

    extensionsToTreatAsEsm: ['.ts'],

    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
        },],
    },

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    testMatch: ['<rootDir>/src/tests/**/*.test.ts',],
};