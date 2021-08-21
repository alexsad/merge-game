const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {

  // const wsProxy = createProxyMiddleware('/ws', {
  //   target: 'ws://parseapi.back4app.com',
  //   pathRewrite: {
  //     '^/ws' : '/',        // rewrite path.
  //     '^/parse-api' : ''               // remove path.
  //    },
  //   changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  //   ws: true, // enable websocket proxy
  //   logLevel: 'debug'
  // });


  app.use(
    '/bass-api',
    createProxyMiddleware({
      // target: 'https://api.parse.com', // target host
      target: 'https://zkicsetztdaigfpjfeor.supabase.co',
      changeOrigin: true, // needed for virtual hosted sites
      ws: true, // proxy websockets
      pathRewrite: {
        '^/bass-api': '/', // rewrite path
      },
      logLevel: 'debug',
    }),
  );

  // app.use(
  //   '/nada-disso',
  //   createProxyMiddleware({
  //     target: 'https://parseapi.back4app.com',
  //     pathRewrite: {
  //       '^/nada-disso': '/', // rewrite path
  //      },
  //     changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  //     ws: true, // enable websocket proxy
  //     logLevel: 'debug'
  //   })
  // );


};