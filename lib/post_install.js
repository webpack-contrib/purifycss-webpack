/* eslint-disable */
// adapted based on rackt/history (MIT)
// Node 4+
var execSync = require('child_process').execSync;
var stat = require('fs').stat;

function exec(command) {
  execSync(command, {
    stdio: [0, 1, 2]
  });
}

stat('dist', function(error, stat) {
  // Skip building on Travis
  if (process.env.TRAVIS) {
    return;
  }

  if (error || !stat.isDirectory()) {
    exec('npm i babel-cli babel-preset-es2015 babel-plugin-syntax-object-rest-spread babel-plugin-transform-object-rest-spread');
    exec('npm run build');
  }
});
