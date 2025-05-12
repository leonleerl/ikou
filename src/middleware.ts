import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// List of paths that require authentication
const protectedPaths = ['/dashboard']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  // If the path is not protected, allow the request
  if (!isProtectedPath) {
    return NextResponse.next()
  }
  
  // Get the token from cookies or authorization header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.split(' ')[1]
  
  // If there's no token and the path is protected, redirect to the home page
  if (!token) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }
  
  try {
    // Verify the token
    // Note: In a real application, you'd use a secret from environment variables
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret')
    await jwtVerify(token, secret)
    
    // Token is valid, allow the request
    return NextResponse.next()
  } catch (error) {
    // Token is invalid, redirect to home
    console.error('Token verification failed:', error)
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    // Apply to all paths except for next.js assets, api routes, and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 