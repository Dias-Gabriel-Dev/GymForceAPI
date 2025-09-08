export default {
  transform: {},
  globalSetup: '<rootDir>/__tests__/setup.js',
  globalTeardown: '<rootDir>/__tests__/teardown.js',
  testPathIgnorePatterns: ['<rootDir>/__tests__/setup.js', '<rootDir>/__tests__/teardown.js'],
};