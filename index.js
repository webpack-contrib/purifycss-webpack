var fs = require('fs');

var PurifyCssPlugin = function(absolutePath) {
  var htmlPaths = Array.prototype.slice.call(arguments, 1);
  this.htmlContent = concatFiles(absolutePath, htmlPaths);
};

module.exports = PurifyCssPlugin;

var concatFiles = function(absolutePath, filePaths){
  return filePaths.reduce(function(content, filePath){
    return content + fs.readFileSync(absolutePath + filePath, 'utf8');
  }, '');
};

var isCss = function(module){
  return module._source && module._source._value && 
         module._source._name.indexOf('.css') > -1;
};

var isContent = function(module){
  return module._source && module._source._value && 
         module._source._name.indexOf('.css') === -1;
};

var getContentHash = function(compilation){
  return compilation.chunks.reduce(function(contentHash, chunk){
    var modules = chunk.modules;
    var content = modules.reduce(function(total, m){
      if(isContent(m)){
        total += m._source._value;
      }

      return total;
    }, '');

    contentHash[chunk.name] = content;
    return contentHash;
  }, {});
};

var getCssModules = function(modules){
  return modules.filter(function(module){
    return isCss(module);
  });
};

PurifyCssPlugin.prototype.apply = function(compiler) {
  var chunkContent;
  var cssModules;
  var htmlContent = this.htmlContent;

  compiler.plugin('this-compilation', function(compilation) {
    compilation._purifycss_callback = function(callback){
      if(cssModules.length === 0){
        return callback();
      }

      var nextModule = cssModules.pop();
      compilation._purifycss_content = htmlContent;

      nextModule.chunks.forEach(function(chunk){
        compilation._purifycss_content += chunkContent[chunk.name] + ' ';
      });

      compilation.rebuildModule(nextModule, function(err){
        if(err){
          console.log(err);
        }

        compilation._purifycss_callback(callback);
      });
    };

    compilation.plugin('optimize-tree',  function(chunks, modules, callback) {
      chunkContent = getContentHash(compilation);
      cssModules = getCssModules(modules);
      compilation._purifycss_callback(callback);
    });
  });
};
