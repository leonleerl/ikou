// src/app/api/auth/[id]/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
    try {
      // 首先验证请求者是否已登录
      const cookieHeader = req.headers.get('cookie');
      if (!cookieHeader) {
        return NextResponse.json({ error: 'Unauthorized, no cookie' }, { status: 401 });
      }

      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      if (!tokenMatch) {
        return NextResponse.json({ error: 'Unauthorized, no token' }, { status: 401 });
      }

      const token = tokenMatch[1];
      
      // 验证token
      jwt.verify(token, JWT_SECRET);
      
      // 验证通过后，获取请求的用户信息
      const userId = parseInt(id, 10);
      
      if (isNaN(userId)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
      }
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, createdAt: true }
      });
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      return NextResponse.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 });
    }
  
}