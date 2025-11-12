import express from 'express';
import { getTransaction } from '../lib/cwaypay.js';
const router = express.Router();

router.get('/transactions', async (req, res, next) => {
  try {
    const { id, clientIdentifier } = req.query;
    if (!id && !clientIdentifier) return res.status(400).json({ error: 'informe id ou clientIdentifier' });
    const data = await getTransaction({ id, clientIdentifier });
    res.json(data);
  } catch (err) {
    if (err.response) {
      console.error('CWAY PAY error:', err.response.status, err.response.data);
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
});

export default router;
