import { NextRequest, NextResponse } from 'next/server';

// Rate limit store (in-memory, for production use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 100; // Max requests per window
const RATE_LIMIT_AUTH_MAX = 5; // Max auth attempts

/**
 * Get IP address from request
 */
export function getIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1';
  return ip.trim();
}

/**
 * Check rate limit for API routes
 */
export function checkRateLimit(
  request: NextRequest, 
  maxRequests: number = RATE_LIMIT_MAX
): { success: boolean; remaining: number; resetTime: number } {
  const ip = getIP(request);
  const now = Date.now();
  
  const userLimit = rateLimitStore.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset counter
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
  }
  
  userLimit.count++;
  
  if (userLimit.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: userLimit.resetTime,
    };
  }
  
  return {
    success: true,
    remaining: maxRequests - userLimit.count,
    resetTime: userLimit.resetTime,
  };
}

/**
 * Rate limit middleware helper for API routes
 */
export function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  maxRequests: number = RATE_LIMIT_MAX
): Promise<NextResponse> {
  const result = checkRateLimit(request, maxRequests);
  
  if (!result.success) {
    return Promise.resolve(
      NextResponse.json(
        { 
          error: 'Demasiadas solicitudes',
          message: 'Has excedido el límite de solicitudes. Por favor espera unos minutos.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    );
  }
  
  return handler();
}

export { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX, RATE_LIMIT_AUTH_MAX };
