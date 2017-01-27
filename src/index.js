import purify from 'purify-css';
import { ConcatSource } from 'webpack-sources';
import * as parse from './parse';
import * as search from './search';
import validateOptions from './validate-options';
import schema from './schema';

module.exports = function PurifyPlugin(options) {
  const validation = validateOptions(schema, options);

  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  return {
    apply(compiler) {
      compiler.plugin('this-compilation', (compilation) => {
        const paths = parse.paths(options.paths);

        // Output debug information through a callback pattern
        // to avoid unnecessary processing
        const output = options.verbose ?
          messageCb => console.info(...messageCb()) :
          () => {};

        compilation.plugin('additional-assets', (cb) => {
          // Go through chunks and purify as configured
          compilation.chunks.forEach(
            ({ name: chunkName, modules }) => {
              const assetsToPurify = search.assets(
                compilation.assets, options.styleExtensions
              ).filter(
                asset => asset.name.indexOf(chunkName) >= 0
              );

              output(() => [
                'Assets to purify:',
                assetsToPurify.map(({ name }) => name).join(', ')
              ]);

              assetsToPurify.forEach(({ name, asset }) => {
                const filesToSearch = (paths[chunkName] || paths).concat(
                  search.files(
                    modules, options.moduleExtensions || [], file => file.resource
                  )
                );

                output(() => [
                  'Files to search for used rules:',
                  filesToSearch.join(', ')
                ]);

                // Compile through Purify and attach to output.
                // This loses sourcemaps should there be any!
                compilation.assets[name] = new ConcatSource(
                  purify(
                    filesToSearch,
                    asset.source(),
                    {
                      info: options.verbose,
                      ...options.purifyOptions
                    }
                  )
                );
              });
            }
          );

          cb();
        });
      });
    }
  };
};
