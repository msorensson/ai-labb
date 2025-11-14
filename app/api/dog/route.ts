import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongoose';
import { DogProfile } from '../../../models/DogProfile';

export async function GET() {
  await connectToDatabase();
  const profile = await DogProfile.findOne().lean();
  if (!profile) return NextResponse.json(null, { status: 200 });
  return NextResponse.json({ id: String(profile._id), name: profile.name, bio: profile.bio, facts: profile.facts ?? [], createdAt: profile.createdAt });
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const update: any = {};
  if (typeof body.name === 'string') update.name = body.name;
  if (typeof body.bio === 'string') update.bio = body.bio;
  if (Array.isArray(body.facts)) update.facts = body.facts.map((f: any) => String(f));

  const existing = await DogProfile.findOne();
  let doc;
  if (existing) {
    existing.set(update);
    doc = await existing.save();
  } else {
    doc = await DogProfile.create(update);
  }
  return NextResponse.json({ id: String(doc._id), name: doc.name, bio: doc.bio, facts: doc.facts ?? [], createdAt: doc.createdAt });
}


