import { NextResponse } from 'next/server';
import users from './index.js';

export async function GET() {
  return NextResponse.json(users);
}


