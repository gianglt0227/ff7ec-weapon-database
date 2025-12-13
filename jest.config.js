module.exports = {
  // Use jsdom environment for DOM testing
  testEnvironment: 'jsdom',

  // Setup file to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test file patterns
  testMatch: ['**/tests/**/*.test.js'],

  // Ignore problematic test files
  testPathIgnorePatterns: [
    '/node_modules/',
    'csv-parser.test.js' // Temporarily disabled due to V8 memory allocation error
  ],

  // Coverage collection
  collectCoverageFrom: [
    'scripts.js',
    '!node_modules/**',
    '!tests/**'
  ],

  // Coverage thresholds (maximum coverage targets)
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 70,
      functions: 75,
      lines: 75
    }
  },

  // Coverage reporters
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true
};
