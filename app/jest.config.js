module.exports = {
  // setupFiles: ['../test/unit/setup-jest-unit.js'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '/__tests__/queries.js',
    '/__tests__/setupJest.js',
    '<rootDir>/app_deploy/',
    '<rootDir>/dist/',
    '<rootDir>/test/',
  ],
};
