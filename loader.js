var purify = require('purify-css');

module.exports = function(input){
  if(typeof this._compilation._purifycss_content === 'undefined'){
    return input;
  }
  
  var content = this._compilation._purifycss_content;

  return purify(content, input);
};
