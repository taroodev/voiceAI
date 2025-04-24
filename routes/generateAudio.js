const express = require('express');
const router = express.Router();
const elevenLabsService = require('../services/elevenLabsService');

const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { texto } = req.body;

  if (!texto || texto.trim() === '') {
    return res.status(400).json({ error: 'Texto requerido' });
  }

  try {
    const textoUsuario = texto;

  
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: textoUsuario }],
    });

    const textoRespuesta = chatCompletion.choices[0].message.content;


    const audioBuffer = await elevenLabsService.generarAudio(textoRespuesta);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="respuesta.mp3"'
    });
    res.send(audioBuffer);
  } catch (error) {
    console.error('Error generando audio:', error.message);
    res.status(500).json({ error: 'Error al generar el audio' });
  }
});

module.exports = router;