module.exports = {
  "extends": "airbnb",
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "rules": {
    "import/no-unresolved": 0, // fails at travis
    "import/extensions": 0, // fails at travis
    "prefer-arrow-callback": 0, // mocha tests (recommendation)
    "func-names": 0, // mocha tests (recommendation)
    "comma-dangle": ["error", "never"], // personal preference
    "no-param-reassign": 0, // the plugin needs this (webpack design :( )
    "no-use-before-define": 0, // personal preference
    "no-console": 0 // allow logging
  }
};
