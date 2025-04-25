// ─── Importaciones ──────────────────────────────────────────
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';

import generateAudioRoute from './routes/generateAudio.js';

// ─── Instancia y puerto ─────────────────────────────────────
const app  = express();                     // 1️⃣  crear primero
const port = process.env.PORT || 3000;

// ─── Middlewares globales ───────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || true, // varios dominios
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '2mb' }));    // body-parser
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },    // 5 MB máx
  abortOnLimit: true,
}));
app.use(morgan('dev'));                     // logs

// ─── Rutas ──────────────────────────────────────────────────
app.use('/api/generate-audio', generateAudioRoute);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/', (_req, res) =>
  res.send('✅ VoiceAI backend operativo')
);

// ─── Manejador de errores global ────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

// ─── Arranque ───────────────────────────────────────────────
app.listen(port, () =>
  console.log(`VoiceAI listo en http://localhost:${port}`)
);
