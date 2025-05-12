import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  // Create response
  const response = NextResponse.json({ 
    token, 
    user: { id: user.id, email: user.email, name: user.name } 
  });

  console.log(response.cookies)
  
  // Set cookie in the response
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60, // 1 hour
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });

  return response;
}