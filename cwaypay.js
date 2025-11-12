// lib/cwaypay.js
import axios from 'axios';

const BASE_URL = process.env.CWAY_BASE_URL || 'https://app.cwaypay.com.br/api/v1';

/**
 * Monta os headers de autenticação da CWAY
 */
export function authHeaders() {
  const pub = (process.env.CWAY_PUBLIC_KEY || '').trim();
  const sec = (process.env.CWAY_SECRET_KEY || '').trim();

  const h = {
    Accept: 'application/json',
    'User-Agent': 'RiquezaDigital/1.0 (+https://seu-dominio)',
  };

  if (pub && sec) {
    // formato típico de autenticação da CWAY: chave pública + secreta
    const basicAuth = Buffer.from(`${pub}:${sec}`).toString('base64');
    h.Authorization = `Basic ${basicAuth}`;
  } else if (sec) {
    // fallback: só Bearer se tiver apenas o secret
    h.Authorization = `Bearer ${sec}`;
  } else {
    console.warn('[authHeaders] Nenhuma credencial CWAY configurada');
  }

  return h;
}

/**
 * Cria uma cobrança Pix
 */
export async function receivePix(payload) {
  const url = `${BASE_URL}/gateway/pix/receive`;
  const { data } = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    timeout: 15000,
  });
  return data;
}

/**
 * Consulta transação
 */
export async function getTransaction(id) {
  const url = `${BASE_URL}/gateway/transactions?id=${id}`;
  const { data } = await axios.get(url, { headers: authHeaders() });
  return data;
}
