import { openai } from '../lib/openaiClient.js';   // factoriza tu cliente o usa new OpenAI(...)
import fs from 'fs-extra';

export const transcribirAudio = async (file) => {
  // file proviene de express-fileupload → { name, data, mimetype, size … }
  const tmpPath = `/tmp/${Date.now()}_${file.name}`;
  await fs.writeFile(tmpPath, file.data);

  const { text } = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file : fs.createReadStream(tmpPath),     // stream requerido
    language: 'es',                          // idioma del audio
    response_format: 'text',
  });

  await fs.remove(tmpPath);
  return text;                               // devuelve el texto transcrito
};
