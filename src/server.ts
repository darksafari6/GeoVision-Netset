import { GoogleGenAI } from '@google/genai';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createServer } from 'node:http';
import crypto from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(__dirname, '../dist/app/browser');
const app = express();
const server = createServer(app);
const port = Number(process.env['PORT'] || 3000);
app.disable('x-powered-by');
app.use(express.json({ limit: '12mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '20mb' }));

const apiKey = process.env['GEMINI_API_KEY'];
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;
const upstreamJson = async (url: string, init?: RequestInit) => { const response = await fetch(url, init); if (!response.ok) throw new Error(`Upstream request failed: ${response.status}`); return response.json(); };

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'geovision-api', timestamp: new Date().toISOString() }));
app.get('/api/ip-info', async (_req, res) => { try { res.json(await upstreamJson('https://ipapi.co/json/')); } catch { res.status(502).json({ error: 'IP intelligence provider unavailable.' }); } });

app.get('/api/geocode', async (req, res) => {
  const query = typeof req.query['q'] === 'string' ? req.query['q'].trim() : '';
  if (query.length < 2 || query.length > 160) return res.status(400).json({ error: 'Query must contain 2–160 characters.' });
  try { const url = new URL('https://nominatim.openstreetmap.org/search'); url.searchParams.set('q', query); url.searchParams.set('format', 'jsonv2'); url.searchParams.set('addressdetails', '1'); url.searchParams.set('limit', '8'); res.setHeader('Cache-Control', 'public, max-age=300'); res.json(await upstreamJson(url.toString(), { headers: { 'User-Agent': 'GeoVision-AI-Platform/1.1 (+https://github.com/darksafari6/GeoVision-Netset)' } })); }
  catch { res.status(502).json({ error: 'Geocoding provider unavailable.' }); }
});

app.get('/api/reverse-geocode', async (req, res) => {
  const lat = Number(req.query['lat']); const lon = Number(req.query['lon']);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) return res.status(400).json({ error: 'Valid latitude and longitude are required.' });
  try { const url = new URL('https://nominatim.openstreetmap.org/reverse'); url.searchParams.set('lat', String(lat)); url.searchParams.set('lon', String(lon)); url.searchParams.set('format', 'jsonv2'); res.json(await upstreamJson(url.toString(), { headers: { 'User-Agent': 'GeoVision-AI-Platform/1.1 (+https://github.com/darksafari6/GeoVision-Netset)' } })); }
  catch { res.status(502).json({ error: 'Reverse geocoding provider unavailable.' }); }
});

app.post('/api/analyze-image', async (req, res) => {
  const { imageBase64, mimeType } = req.body ?? {};
  if (!genAI) return res.status(503).json({ error: 'Gemini AI is not configured on this server.' });
  if (typeof imageBase64 !== 'string' || imageBase64.length < 100 || imageBase64.length > 11_000_000) return res.status(400).json({ error: 'Invalid image payload.' });
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic']); const safeMime = allowed.has(mimeType) ? mimeType : 'image/jpeg'; const data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  if (!/^[A-Za-z0-9+/=]+$/.test(data)) return res.status(400).json({ error: 'Invalid base64 image.' });
  try { const result = await genAI.models.generateContent({ model: 'gemini-2.5-flash', contents: [{ role: 'user', parts: [{ text: 'Analyze this image for geolocation. Use visible landmarks, architecture, signs, road markings, terrain, vegetation and cultural clues. Return strict JSON with city, country, latitude, longitude, confidence (0-1), and clues (array). Never claim exact coordinates unless evidence supports them.' }, { inlineData: { data, mimeType: safeMime } }] }], config: { responseMimeType: 'application/json' } }); res.json(JSON.parse(result.text ?? '{}')); }
  catch (error) { console.error('Gemini image analysis failed', error); res.status(502).json({ error: 'AI image analysis failed.' }); }
});

app.get('/api/ping', (_req, res) => res.status(204).end());
app.get('/api/speed-test/download', (req, res) => { const requested = Number(req.query['bytes'] ?? 5_000_000); const bytes = Math.min(Math.max(Number.isFinite(requested) ? Math.floor(requested) : 5_000_000, 256_000), 20_000_000); const buffer = Buffer.allocUnsafe(bytes); crypto.randomFillSync(buffer); res.set({ 'Content-Type': 'application/octet-stream', 'Content-Length': String(bytes), 'Cache-Control': 'no-store' }); res.end(buffer); });
app.post('/api/speed-test/upload', (req, res) => { const body = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0); res.set('Cache-Control', 'no-store').json({ bytes: body.length }); });

app.use(express.static(browserDistFolder, { maxAge: '1h', index: 'index.html' }));
app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(resolve(browserDistFolder, 'index.html')));
if (import.meta.url === `file://${resolve(process.argv[1])}`) server.listen(port, () => console.log(`GeoVision API listening on http://localhost:${port}`));
export default app;
