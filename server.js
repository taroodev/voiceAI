import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

import generateAudioRoute from './routes/generateAudio.js';


app.use(express.json());
app.use('/api/generate-audio', generateAudioRoute);
app.get('/', (req, res) => {
    res.send('Servidor VoiceAI funcionando ✅');
  });
  
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
