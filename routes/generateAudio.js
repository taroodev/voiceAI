import express from 'express'; 
import dotenv from 'dotenv';  
import { generarAudio } from '../services/elevenLabsService.js';  
import { OpenAI } from "openai";  


dotenv.config();


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = express.Router();

router.post('/', async (req, res) => {
  const { texto } = req.body;

  if (!texto || texto.trim() === '') {
    return res.status(400).json({ error: 'Texto requerido' });
  }

  try {
    const textoUsuario = texto;
  
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",  
      messages: [{ role: "user", content: textoUsuario }],
    });

    const textoRespuesta = chatCompletion.choices[0].message.content;

    const audioBuffer = await generarAudio(textoRespuesta);

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

export default router;
