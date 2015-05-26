var purify = require('purify-css');

module.exports = function(input){
  if(typeof this._compilation.__content === 'undefined'){
    return input;
  }

  console.log(this._compilation.__content.length);
  console.log('');
  console.log('YOOOOOOOOOOOOOOOOO');
  console.log('');
  return purify(this._compilation.__content, input);
};
