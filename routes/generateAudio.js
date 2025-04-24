import express from 'express';
import { generarAudio } from '../services/elevenLabsService.js';
import { transcribirAudio } from '../services/whisperService.js';   // ⬅️  NUEVO
import { OpenAI } from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    // ‼️  Detecta si llega audio (multipart/form-data) o JSON con texto
    let prompt;
    if (req.is('application/json')) {
      const { texto } = req.body;
      if (!texto?.trim()) return res.status(400).json({ error: 'Texto requerido' });
      prompt = texto;
    } else if (req.is('multipart/form-data')) {
      if (!req.files?.audio) return res.status(400).json({ error: 'Audio requerido' });
      prompt = await transcribirAudio(req.files.audio);     // Whisper u OpenAI Speech-to-Text
    } else {
      return res.status(415).json({ error: 'Tipo de contenido no soportado' });
    }

    // GPT-4o  (streaming opcional)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    const respuesta = completion.choices[0]?.message?.content || 'No entendí 🤖';

    // ElevenLabs (control de longitud → máx. 2 500 caracteres / 100 líneas aprox.)
    if (respuesta.length > 2400) throw new Error('La respuesta supera el límite de ElevenLabs');
    const audioBuffer = await generarAudio(respuesta);

    res.set({
      'Content-Type'     : 'audio/mpeg',
      'Content-Disposition': 'inline; filename="respuesta.mp3"',
      'Content-Length'   : audioBuffer.byteLength,
    });
    res.send(audioBuffer);

  } catch (error) {
    console.error('Error en /generate-audio →', error);
    next(error);                              // ⬅️  delega al manejador global
  }
});
