const jestConfig = require('tsdx/dist/createJestConfig').createJestConfig(
  '.',
  __dirname
);

const jestConfigFromPackage = require('./package.json').jest;

jestConfig.transform = {
  ...jestConfigFromPackage.transform,
  ...jestConfig.transform,
};
jestConfig.moduleNameMapper = jestConfigFromPackage.moduleNameMapper;
jestConfig.setupFiles = jestConfigFromPackage.setupFiles;

module.exports = jestConfig;
