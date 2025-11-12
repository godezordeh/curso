// server.js (topo)
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// carrega a .env que está AO LADO do server.js
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';


import checkoutRouter from './routes/checkout.js';
import webhookRouter from './routes/webhook.js';
import transactionsRouter from './routes/transactions.js';
import qrcodeRouter from './routes/qrcode.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/pix', checkoutRouter);      // /pix/checkout, /pix/qrcode
app.use('/pix', qrcodeRouter);        // /pix/qrcode?emv=...
app.use('/webhooks', webhookRouter);  // /webhooks/cwaypay
app.use('/gateway', transactionsRouter); // /gateway/transactions

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`CWAY PAY Pix API running on http://localhost:${PORT}`);
});
app.get('/debug/env', (req, res) => {
  const key = (process.env.CWAYPAY_API_KEY || '').trim();
  const masked = key ? `${key.slice(0,6)}… (len=${key.length})` : null;
  res.json({
    cwd: process.cwd(),
    envLoadedFrom: '.env ao lado do server.js',
    CWAYPAY_API_KEY_present: !!key,
    CWAYPAY_API_KEY_masked: masked,
    CWAYPAY_X_API_KEY_present: !!process.env.CWAYPAY_X_API_KEY,
    WEBHOOK_URL: process.env.WEBHOOK_URL || null
  });
});

