import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.post('/cwaypay', async (req, res) => {
  const payload = req.body;
  const expected = process.env.WEBHOOK_TOKEN;
  const valid = expected ? payload?.token === expected : true;

  try {
    const logPath = path.join(process.cwd(), 'data', 'webhooks.log');
    fs.appendFileSync(logPath, JSON.stringify({ at: new Date().toISOString(), valid, payload }) + '\n');
  } catch (e) {}

  if (!valid) return res.status(401).json({ ok: false, error: 'invalid webhook token' });

  // TODO: marcar pedido como pago quando COMPLETED
  return res.json({ ok: true });
});

export default router;
