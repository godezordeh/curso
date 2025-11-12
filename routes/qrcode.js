import express from 'express';
import QRCode from 'qrcode';

const router = express.Router();

/**
 * GET /pix/qrcode?emv=...
 * Retorna um SVG do QR Code para o EMV informado.
 */
router.get('/qrcode', async (req, res) => {
  const emv = req.query.emv;
  if (!emv) return res.status(400).send('missing emv');
  try {
    const svg = await QRCode.toString(emv, { type: 'svg', margin: 1, width: 512 });
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.send(svg);
  } catch (e) {
    res.status(500).json({ error: 'failed_to_generate_qr' });
  }
});

export default router;
