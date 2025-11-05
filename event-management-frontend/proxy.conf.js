const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = [
  {
    context: ['/api'],
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    onProxyRes: (proxyRes) => {
      // Prevent browser Basic Auth prompt when backend sends WWW-Authenticate for 401
      if (proxyRes && proxyRes.headers) {
        delete proxyRes.headers['www-authenticate'];
      }
    },
  },
];
