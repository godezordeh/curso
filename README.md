# CWAY PAY — API Pix (Checkout + Webhook + Consulta + QR)

## Rotas
- `POST /pix/checkout` → cria a cobrança Pix na CWAY PAY.
- `GET  /pix/qrcode?emv=...` → retorna **SVG** do QR Code (para usar na landing).
- `POST /webhooks/cwaypay` → recebe webhooks; valide com `WEBHOOK_TOKEN`.
- `GET  /gateway/transactions?id=...` → consulta transação.

## Uso rápido
```bash
npm install
cp .env.example .env
# preencha as chaves/URLs
npm run dev
```

Apontar a landing para o domínio desta API em `assets/js/script.js` com `API_BASE_URL`.
