import { NextResponse } from 'next/server';
import users from '../index.js';

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  const user = (users as any[]).find((u) => u.id === id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}


