module.exports = function (wallaby) {
  return {
    debug: true,
    env: {
      NODE_ENV: 'testing',
      type: 'node',
    },
    files: ['./package.json', './src/**/*.ts', './src/*.ts', '!./src/tests/**/*.test.ts', '!./src/tests/*.test.ts'],
    filesWithNoCoverageCalculated: ['src/tests/**/*', './src/tests/*'],
    tests: ['./src/tests/**/*.test.ts', './src/tests/*.test.ts'],
    localProjectDir: __dirname,
    setup: function (wallaby) {
      var mocha = wallaby.testFramework
      mocha.ui('tdd')
    },
    testFramework: 'mocha',
  }
}
