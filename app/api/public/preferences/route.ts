import { NextResponse } from 'next/server';
import preferences, { byUser } from './index.js';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (userId) {
    const userPrefs = (byUser as any)?.[userId];
    if (userPrefs) {
      return NextResponse.json(userPrefs);
    }
    // Fallback: convert default key/value array to an object
    const fallback = Object.fromEntries((preferences as any[]).map((p) => [p.key, p.value]));
    return NextResponse.json(fallback);
  }

  // No userId: return the default array format
  return NextResponse.json(preferences);
}


