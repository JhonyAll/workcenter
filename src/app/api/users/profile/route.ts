// src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenAndGetUser } from '@/utils/authHelper';

export async function GET(req: NextRequest) {
  const user = await verifyTokenAndGetUser(req);
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  return NextResponse.json({ user });
}
