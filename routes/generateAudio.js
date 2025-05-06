// routes/generate-text.js
import express from 'express';
import { transcribirAudio } from '../services/whisperService.js'; // sigue siendo útil si permites audio
import { openai } from '../lib/openaiClient.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    /* 1️⃣ ── Obtener el prompt -------------------------------------------- */
    let prompt;

    if (req.is('application/json')) {
      const { texto } = req.body;
      if (!texto?.trim()) {
        return res.status(400).json({ error: 'Texto requerido' });
      }
      prompt = texto;

    } else if (req.is('multipart/form-data')) {
      if (!req.files?.audio) {
        return res.status(400).json({ error: 'Audio requerido' });
      }
      prompt = await transcribirAudio(req.files.audio); // Whisper / STT
    } else {
      return res.status(415).json({ error: 'Tipo de contenido no soportado' });
    }

    /* 2️⃣ ── Llamar al LLM -------------------------------------------------- */
    const completion = await openai.chat.completions.create({
      model   : 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const respuesta =
      completion.choices[0]?.message?.content?.trim() || 'No entendí 🤖';

    /* 3️⃣ ── Responder en JSON --------------------------------------------- */
    res.json({ respuesta });

  } catch (error) {
    console.error('Error en /generate-text →', error);
    next(error);
  }
});

export default router;
