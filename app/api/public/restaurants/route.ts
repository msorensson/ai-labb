import { NextResponse } from 'next/server';
import restaurants from './index.js';

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radiusKm = parseFloat(searchParams.get('radiusKm') || searchParams.get('radius') || '') || 5;
  const limit = parseInt(searchParams.get('limit') || '', 10);

  if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
    const withDistance = (restaurants as any[]).map((r) => {
      const coords = r?.location?.coordinates;
      const isPoint = r?.location?.type === 'Point';
      const hasLoc = isPoint && Array.isArray(coords) && coords.length === 2 && coords.every((n: any) => typeof n === 'number');
      const targetLat = hasLoc ? coords[1] : undefined; // [lng, lat]
      const targetLng = hasLoc ? coords[0] : undefined;
      const d = hasLoc ? haversineKm(lat, lng, targetLat as number, targetLng as number) : Number.POSITIVE_INFINITY;
      return { ...r, distanceKm: Math.round(d * 100) / 100 };
    });
    const filtered = withDistance
      .filter((r) => r.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
    const sliced = Number.isFinite(limit) && limit > 0 ? filtered.slice(0, limit) : filtered;
    return NextResponse.json(sliced);
  }

  return NextResponse.json(restaurants);
}


