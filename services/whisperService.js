import { openai } from '../lib/openaiClient.js';   
import fs from 'fs-extra';

export const transcribirAudio = async (file) => {

  const tmpPath = `/tmp/${Date.now()}_${file.name}`;
  await fs.writeFile(tmpPath, file.data);

  const { text } = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file : fs.createReadStream(tmpPath),     
    language: 'es',                         
    response_format: 'text',
  });

  await fs.remove(tmpPath);
  return text;                               
};
