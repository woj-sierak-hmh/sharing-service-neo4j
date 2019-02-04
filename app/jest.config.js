module.exports = {
  // setupFiles: ['../test/unit/setup-jest-unit.js'],
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
