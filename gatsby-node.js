/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.

exports.onCreateWebpackConfig = ({
  stage,
  actions,
  getConfig
}) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: { "url": require.resolve("url/") }
    }
  })
  
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      externals: getConfig().externals.concat(({context, request}, cb) => {
        const regex = /^@?firebase(\/(.+))?/
        // exclude firebase products from being bundled, so they will be loaded using require() at runtime.
        if (regex.test(request)) {
          return cb(null, `commonjs ${request}`) // <- use commonjs!
        }
        cb()
      }),
    })
  }
};



