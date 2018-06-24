const path = require('path');
const semver = require('semver');

const version = process.versions.node;
const packageJson = path.join(process.cwd(), 'package.json');

let pkg;
try {
  pkg = require(packageJson); // eslint-disable-line import/no-dynamic-require
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
const expected = pkg.engines && pkg.engines.node;

if (!expected || typeof expected !== 'string') {
  console.error('Node version is not specified in package.json!');
}

if (!semver.satisfies(version, expected)) {
  const msg = `You are using node ${version} but ${pkg.name} requires ${expected}.`;
  console.error(msg);
  process.exit(1);
}
