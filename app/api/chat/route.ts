import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongoose';
import { ChatMessage } from '../../../models/ChatMessage';
import { getOpenAI, DEFAULT_OPENAI_MODEL } from '../../../lib/openai';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  await connectToDatabase();
  const { message } = await req.json();

  // Save user message
  const userDoc = await ChatMessage.create({ body: String(message ?? ''), role: 'user' });

  // Generate bot reply via OpenAI; on empty/failed response, use a clear error message
  let botText: string;
  try {
    const openai = getOpenAI();
    async function readDogProfileFromFile() {
      try {
        const filePath = path.join(process.cwd(), 'data', 'dog_profile.txt');
        const buf = await fs.readFile(filePath);
        const text = buf.toString('utf8').trim();
        return text || 'Ingen hundprofil är angiven ännu.';
      } catch {
        return 'Ingen hundprofil är angiven ännu.';
      }
    }
    const profileText = await readDogProfileFromFile();

    const completion = await openai.chat.completions.create({
      model: DEFAULT_OPENAI_MODEL,
      messages: [
        { role: 'system', content: `
            Du är en hjälpsam hundassistent. 
            Du svarar ENDAST på frågor om användarens hund. 
            Om frågan inte gäller hunden svarar du artigt att du bara kan prata om hunden och föreslår hundrelaterade ämnen. 
            Håll svaren koncisa. 
            Detektera det språk som frågan ställs på och svara på samma språk. 
            `
        },
        { role: 'system', content: `Hundprofil:\n${profileText}` },
        { role: 'user', content: String(message ?? '') }
      ]
    });
    botText = completion.choices[0]?.message?.content ?? '';
    if (!botText) {
      console.error('OpenAI returned empty content for prompt.');
      botText = 'Något gick fel!';
    }
  } catch (err) {
    console.error('OpenAI error:', err);
    botText = 'Något gick fel!';
  }

  const botDoc = await ChatMessage.create({ body: botText, role: 'bot' });

  return NextResponse.json({
    user: { id: String(userDoc._id), role: userDoc.role, body: userDoc.body, createdAt: userDoc.createdAt },
    bot: { id: String(botDoc._id), role: botDoc.role, body: botDoc.body, createdAt: botDoc.createdAt }
  });
}

export async function GET() {
  await connectToDatabase();
  const docs = await ChatMessage.find().sort({ createdAt: 1 }).limit(100).lean();
  return NextResponse.json(docs.map((d: any) => ({ id: String(d._id), role: d.role, body: d.body, createdAt: d.createdAt })));
}


