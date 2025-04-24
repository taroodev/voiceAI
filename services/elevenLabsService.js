
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; 

const generarAudio = async (texto) => {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

  const headers = {
    'xi-api-key': API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'audio/mpeg'
  };

  const body = {
    text: texto,
    model_id: 'eleven_monolingual_v1',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75
    }
  };

  const response = await axios.post(url, body, {
    headers,
    responseType: 'arraybuffer'
  });

  return response.data; 
};

module.exports = { generarAudio };
