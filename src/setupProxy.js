const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/Prod',
    createProxyMiddleware({
      target: 'https://dq48y2w3r2.execute-api.eu-west-3.amazonaws.com',
      changeOrigin: true,
    })
  );
};