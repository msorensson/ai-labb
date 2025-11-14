import OpenAI from 'openai';

declare global {
  // eslint-disable-next-line no-var
  var _openai: OpenAI | undefined;
}

export const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }
  if (!global._openai) {
    global._openai = new OpenAI({ apiKey });
  }
  return global._openai;
}


