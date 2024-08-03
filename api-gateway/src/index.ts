// api-gateway/index.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use('/orders', createProxyMiddleware({ target: 'http://orders-service:3000', changeOrigin: true }));
app.use('/payments', createProxyMiddleware({ target: 'http://payments-service:3001', changeOrigin: true }));
app.use('/shipping', createProxyMiddleware({ target: 'http://shipping-service:3002', changeOrigin: true }));

app.listen(2999, () => {
  console.log('API Gateway running on port 2999');
});
