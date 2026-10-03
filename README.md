# 🌍 GeoVision AI Platform

> **Futuristic geospatial intelligence, location analysis and network telemetry for the web.** 🛰️🌐

GeoVision is an Angular 21 application that combines browser geolocation, real IP intelligence, real geocoding, an interactive Three.js Earth, Leaflet mapping, image geolocation through Gemini, and measured network throughput into one responsive workspace.

## ✨ What is implemented

- 🌎 **3D Earth Explorer** — Three.js globe with drag rotation, wheel zoom, adaptive rendering and a 2D OpenStreetMap mode.
- 📍 **Live Location** — Browser Geolocation API with high-accuracy positioning and location-watch support.
- 🔎 **Location Search** — Server-proxied Nominatim search with real place names, coordinates and OpenStreetMap navigation.
- 🔁 **Reverse Geocoding API** — Convert validated latitude/longitude into a real place result.
- 🛰️ **IP Intelligence** — Server-side proxy to `ipapi.co` so provider calls do not expose client-side application logic.
- 🧠 **Visual AI** — Gemini image analysis with MIME validation, payload limits and structured JSON output.
- ⚡ **Network Speed Test** — Real latency samples, jitter calculation, measured download throughput and measured upload throughput. No random/simulated speed values.
- 🎛️ **Responsive navigation** — Desktop rail, mobile drawer and one-handed bottom navigation.
- 🎨 **Futuristic UI** — Glass surfaces, responsive cards, GSAP/Three.js motion and smooth mobile layouts.
- 🧠 **NgRx state foundation** — Central application preference/system state with lazy feature routing.

## 🏗️ Architecture

```text
src/app/
├── core/
│   ├── services/
│   │   ├── geo.service.ts
│   │   └── theme.service.ts
│   └── state/
│       └── app.state.ts
├── features/
│   ├── home/
│   ├── dashboard/
│   ├── explorer/
│   ├── location-search/
│   ├── live-location/
│   ├── ip-intel/
│   ├── speed-test/
│   ├── image-detection/
│   └── settings/
└── app.routes.ts
```

Every major page is lazy-loaded through the Angular router. Browser-only APIs are guarded for SSR, and network/API work is kept behind services or the Express API layer.

## 🔐 Environment

Copy `.env.example` to your deployment environment and configure:

```env
GEMINI_API_KEY=your_server_side_key
APP_URL=https://your-domain.example
```

Never commit a real Gemini key to the repository. The server owns the provider credential.

## 🚀 Run locally

```bash
npm install
npm start
```

For a production build:

```bash
npm run build
```

## 🌐 API surface

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Service health |
| `GET /api/ip-info` | Public IP intelligence |
| `GET /api/geocode?q=` | Place search |
| `GET /api/reverse-geocode?lat=&lon=` | Reverse geocoding |
| `POST /api/analyze-image` | Gemini visual geolocation |
| `GET /api/ping` | Latency measurement |
| `GET /api/speed-test/download` | Download throughput payload |
| `POST /api/speed-test/upload` | Upload throughput measurement |

## 🧩 Production notes

- API keys stay server-side.
- Inputs are validated at the API boundary.
- Image uploads are size- and MIME-limited.
- Geocoding calls are proxied through the backend and use a descriptive User-Agent.
- Speed-test results are measured from actual transferred bytes and persisted locally as test history.
- The 3D explorer uses a capped device pixel ratio to control GPU load.
- Angular routes are split by feature to reduce the initial bundle.

## 📝 Current verification status

The repository has been updated directly on `main`. The available execution environment could not resolve `github.com`, so a fresh remote clone/build could not be run here. The code changes were therefore checked structurally against the existing Angular project files; run `npm install && npm run build` in CI or locally to perform the final compiler/bundle verification.

## 📜 License

MIT

---

### 🧭 GeoVision
**Observe. Locate. Analyze. Understand.** 🌍💚
