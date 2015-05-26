var purify = require('purify-css');

module.exports = function(input){
  if(typeof this._compilation.__content === 'undefined'){
    return input;
  }

  return purify(this._compilation.__content, input);
};
