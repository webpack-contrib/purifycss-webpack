var DemoPlugin = function(rootHtml) {
  this.rootHtml = rootHtml
};

module.exports = DemoPlugin;

DemoPlugin.prototype.apply = function(compiler) {
  compiler.plugin('this-compilation', function(compilation) {

    var content = "";

    compilation.plugin("optimize-modules", function(modules) {

      modules.forEach(function(m){
        if(m._source && m._source._value && 
           m._source._name.indexOf('.css') === -1 &&
           m._source._name.indexOf('node_modules') === -1){
          content += m._source._value;
        }
      });

      compilation.__content = content;

      modules.forEach(function(m){
        if(m._source && m._source._name.indexOf('.css') > -1){
          compilation.rebuildModule(m, function(err){
            if(err) console.log(err);
          });
        }
      });
    });
  });
};
