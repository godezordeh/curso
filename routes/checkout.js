// @ts-nocheck
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { receivePix } from '../lib/cwaypay.js';

const router = express.Router();

router.post('/checkout', async (req, res, next) => {
  try {
    const body = req.body || {};

    // Validação básica
    if (typeof body.amount !== 'number' || isNaN(body.amount)) {
      return res.status(400).json({ error: 'amount é obrigatório e deve ser number' });
    }
    if (!body.client || !body.client?.name || !body.client?.email) {
      return res.status(400).json({ error: 'client.name e client.email são obrigatórios' });
    }

    // Sanitize client
    const client = {
      name: String(body.client.name || '').trim(),
      email: String(body.client.email || '').trim(),
      phone: body.client.phone ? String(body.client.phone).replace(/[^\d+]/g, '') : '',
      cpf: body.client.cpf ? String(body.client.cpf).replace(/\D/g, '') : null
    };

    const identifier = String(body.identifier || `order_${uuidv4()}`);

    // callbackUrl obrigatório em muitas contas; use o do .env ou do body
    let callbackUrl = process.env.WEBHOOK_URL || body.callbackUrl || '';
    if (!callbackUrl) {
      return res.status(400).json({ error: 'callbackUrl/WEBHOOK_URL obrigatório' });
    }
    callbackUrl = String(callbackUrl);

    const payload = {
      identifier,
      amount: Number(body.amount),
      shippingFee: Number(body.shippingFee || 0),
      extraFee: Number(body.extraFee || 0),
      discount: Number(body.discount || 0),
      client,
      products: Array.isArray(body.products) ? body.products : [],
      splits: Array.isArray(body.splits) ? body.splits : [],
      dueDate: body.dueDate ? String(body.dueDate) : undefined,
      metadata: body.metadata || { provider: 'API', landing: 'riqueza-digital' },
      callbackUrl
    };

    const data = await receivePix(payload);
    return res.status(201).json({ identifier, ...data });

  } catch (err) {
    if (err?.response) {
      // Log padrão
      console.error('CWAY PAY error:', err.response.status, err.response.data);

      // Log detalhado de campos inválidos
      const det = err.response.data && err.response.data.details;
      if (Array.isArray(det)) {
        det.forEach((d, i) => {
          console.error(
            `[details ${i}] code=${d.code} expected=${d.expected} ` +
            `received=${d.received} path=${JSON.stringify(d.path)} message=${d.message}`
          );
        });
      }
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
});

export default router;
