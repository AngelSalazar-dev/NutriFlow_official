import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Rate limit store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 500; // Max requests per window

// Enforce JWT_SECRET in production - fail fast if not set
const JWT_SECRET_STRING = process.env.JWT_SECRET;

if (!JWT_SECRET_STRING && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const JWT_SECRET = new TextEncoder().encode(
  JWT_SECRET_STRING || 'dev-secret-do-not-use-in-production'
);

async function verifySessionCookie(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Security Headers
  const response = NextResponse.next();
  
  // Prevent clickjacking - Only allow embedding on same origin
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection (Legacy but still useful for older browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy - Don't leak origin information to 3rd party
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy - Minimize browser feature surface area
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // Content Security Policy (Harden for production)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.google.com https://www.googletagmanager.com https://www.paypal.com https://www.paypalobjects.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.paypalobjects.com",
    "font-src 'self' https://fonts.gstatic.com https://www.paypalobjects.com",
    "img-src 'self' data: https: blob: https://www.paypalobjects.com",
    "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://www.paypal.com https://api.paypal.com https://api.sandbox.paypal.com https://*.google-analytics.com",
    "frame-src 'self' https://js.stripe.com https://www.google.com https://www.paypal.com https://www.sandbox.paypal.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://www.paypal.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // HSTS (HTTP Strict Transport Security) - Enhanced for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload' // 2 years
    );
  }
  
  // Rate limiting for API routes (POST/PUT/DELETE only, not GET)
  if (pathname.startsWith('/api/') && !request.method.startsWith('GET')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    
    const now = Date.now();
    const userLimit = rateLimitStore.get(ip);
    
    if (!userLimit || now > userLimit.resetTime) {
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW,
      });
    } else {
      userLimit.count++;
      
      if (userLimit.count > RATE_LIMIT_MAX) {
        return NextResponse.json(
          { 
            error: 'Demasiadas solicitudes',
            message: 'Has excedido el límite de solicitudes. Por favor espera unos minutos.',
            retryAfter: Math.ceil((userLimit.resetTime - now) / 1000),
          },
          { 
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil((userLimit.resetTime - now) / 1000)),
              'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
              'X-RateLimit-Remaining': '0',
            },
          }
        );
      }
      
      response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
      response.headers.set(
        'X-RateLimit-Remaining',
        String(RATE_LIMIT_MAX - userLimit.count)
      );
      response.headers.set(
        'X-RateLimit-Reset',
        String(Math.ceil(userLimit.resetTime / 1000))
      );
    }
  }
  
  // Protect authenticated routes
  const protectedRoutes = [
    '/dashboard',
    '/food-log',
    '/exercise',
    '/chat',
    '/articles',
    '/history',
    '/profile',
    '/subscription',
    '/settings',
    '/ai-agent',
    '/onboarding',
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie || !(await verifySessionCookie(sessionCookie))) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    const sessionCookie = request.cookies.get('session')?.value;

    if (sessionCookie && await verifySessionCookie(sessionCookie)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // If cookie exists but is invalid, delete it and continue to login
    if (sessionCookie) {
      const response = NextResponse.next();
      response.cookies.delete('session');
      return response;
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
