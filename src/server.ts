import { GoogleGenAI } from "@google/genai";
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createServer } from "node:http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverDistFolder = resolve(__dirname, '../dist/app/server');
const browserDistFolder = resolve(__dirname, '../dist/app/browser');

const app = express();
const server = createServer(app);
const port = process.env['PORT'] || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env['GEMINI_API_KEY'] || '';
const genAI = new GoogleGenAI({ apiKey });

/**
 * IP Intelligence Proxy
 */
app.get('/api/ip-info', async (req, res): Promise<any> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch IP info' });
  }
});

/**
 * AI Image Location Analysis
 */
app.post('/api/analyze-image', async (req, res): Promise<any> => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    // Using any for model to bypass suspicious type error in this environment
    const model = (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Identify the location where this photo was taken. Look for landmarks, architecture, flora, terrain, or signs. Provide a city, country, and estimated coordinates if possible. Format as JSON: { \"city\": \"...\", \"country\": \"...\", \"latitude\": 0, \"longitude\": 0, \"confidence\": 0, \"clues\": [...] }";
    
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64.split(',')[1], mimeType: "image/jpeg" } }
    ]);

    const text = result.response.text();
    // Simple JSON extraction from markdown
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || '{}';
    res.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

/**
 * Speed Test Endpoints
 */
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// Serve static files
app.get(/^(?!\/api).+/, express.static(browserDistFolder, {
  maxAge: '1y',
  index: 'index.html',
}));

// Angular SSR catch-all
app.get(/^(?!\/api).+/, (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;
  // This is a placeholder for actual Angular SSR integration
  // In a full build, @angular/ssr handles this
  res.sendFile(join(browserDistFolder, 'index.html'));
});

if (import.meta.url === `file://${resolve(process.argv[1])}`) {
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
