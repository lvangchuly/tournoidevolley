import { createHash, createHmac } from 'node:crypto';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function hmac(key, value, encoding) {
  return createHmac('sha256', key).update(value).digest(encoding);
}

function getSignatureKey(secretKey, dateStamp, region, service) {
  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, 'aws4_request');
}

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

function normalizeTournamentId(input) {
  const normalized = String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  if (!normalized) {
    throw new Error('Missing or invalid tournament id');
  }

  return normalized;
}

function getObjectKey(tournamentId) {
  const prefix = String(process.env.OVH_S3_PREFIX || 'tournois').replace(/^\/+|\/+$/g, '');
  return `${prefix}/${normalizeTournamentId(tournamentId)}.json`;
}

function encodeS3Path(path) {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`))
    .join('/');
}

async function signedFetch(method, tournamentId, body = '') {
  const endpoint = getRequiredEnv('OVH_S3_ENDPOINT').replace(/\/$/, '');
  const region = getRequiredEnv('OVH_S3_REGION');
  const bucket = getRequiredEnv('OVH_S3_BUCKET');
  const accessKey = getRequiredEnv('OVH_S3_ACCESS_KEY');
  const secretKey = getRequiredEnv('OVH_S3_SECRET_KEY');

  const endpointUrl = new URL(endpoint);
  const host = endpointUrl.host;
  const service = 's3';
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const objectKey = getObjectKey(tournamentId);
  const canonicalUri = `/${bucket}/${encodeS3Path(objectKey)}`;
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  const payloadHash = sha256(payload);
  const headers = {
    host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  };

  if (method === 'PUT') {
    headers['content-type'] = 'application/json; charset=utf-8';
  }

  const sortedHeaderEntries = Object.entries(headers).sort(([a], [b]) => a.localeCompare(b));
  const canonicalHeaders = `${sortedHeaderEntries.map(([key, value]) => `${key}:${String(value).trim()}\n`).join('')}`;
  const signedHeaders = sortedHeaderEntries.map(([key]) => key).join(';');
  const canonicalRequest = [method, canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, sha256(canonicalRequest)].join('\n');
  const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex');
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(`${endpoint}${canonicalUri}`, {
    method,
    headers: {
      ...headers,
      Authorization: authorization,
    },
    body: method === 'PUT' ? payload : undefined,
  });

  return response;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const tournamentId = req.query?.id;

  try {
    if (req.method === 'GET') {
      const response = await signedFetch('GET', tournamentId, '');
      if (response.status === 404) {
        res.status(404).json({ error: 'Shared tournament not found' });
        return;
      }
      if (!response.ok) {
        const details = await response.text();
        res.status(502).json({ error: 'OVHcloud read failed', details });
        return;
      }
      const text = await response.text();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.status(200).send(text);
      return;
    }

    if (req.method === 'PUT') {
      const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      const response = await signedFetch('PUT', tournamentId, payload);
      if (!response.ok) {
        const details = await response.text();
        res.status(502).json({ error: 'OVHcloud write failed', details });
        return;
      }
      res.status(200).json({ ok: true, tournamentId: normalizeTournamentId(tournamentId) });
      return;
    }

    res.setHeader('Allow', 'GET,PUT,OPTIONS');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unexpected error' });
  }
}
