module.exports = {
  "extends": "airbnb",
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "rules": {
    "prefer-arrow-callback": 0, // mocha tests (recommendation)
    "func-names": 0, // mocha tests (recommendation)
    "comma-dangle": ["error", "never"], // personal preference
    "no-param-reassign": 0, // consider enabling this again
    "no-underscore-dangle": 0, // implementation detail (_highlights etc.)
    "no-use-before-define": 0, // personal preference
    "no-console": 0, // Allow logging
    "prefer-spread": 0 // Node 4 doesn't support it :(
  }
};
