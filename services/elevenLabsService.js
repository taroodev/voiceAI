import axios from 'axios';
import 'dotenv/config';

const { ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' } = process.env;

export const generarAudio = async (texto) => {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`;
  try {
    const { data } = await axios.post(
      url,
      {
        text: texto,
        model_id: 'eleven_multilingual_v2',   
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 60_000,
      }
    );
    return data;
  } catch (err) {
    console.error('ElevenLabs error →', err.response?.data || err.message);
    throw err;
  }
};
