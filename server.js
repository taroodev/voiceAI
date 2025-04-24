import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || true, // varios dominios separados por coma
}));
app.use(express.json({ limit: '2mb' }));               // por si los prompts crecen

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import generateAudioRoute from './routes/generateAudio.js';

const app  = express();
const port = process.env.PORT || 3000;

// 1️⃣  CORS para tu dominio(s) WordPress
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || true,
  methods: ['GET', 'POST'],
}));

// 2️⃣  Body parser con límite → el audio y el texto crecen rápido
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.use('/api/generate-audio', generateAudioRoute);

// Ruta de salud (útil para ver si el servidor está vivo)
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// Manejador de errores global
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

app.listen(port, () =>
  console.log(`VoiceAI listo en http://localhost:${port}`)
);
