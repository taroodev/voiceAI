
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const generateAudioRoute = require('./routes/generateAudio');

app.use(express.json());
app.use('/api/generate-audio', generateAudioRoute);
app.get('/', (req, res) => {
    res.send('Servidor VoiceAI funcionando ✅');
  });
  
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
