import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'dog_profile.txt');
    const buf = await fs.readFile(filePath);
    const profileText = buf.toString('utf8');
    return NextResponse.json({ profileText });
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const profileText: string = typeof body?.profileText === 'string' ? body.profileText : '';
  const dirPath = path.join(process.cwd(), 'data');
  const filePath = path.join(dirPath, 'dog_profile.txt');
  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(filePath, profileText, 'utf8');
  return NextResponse.json({ profileText });
}


