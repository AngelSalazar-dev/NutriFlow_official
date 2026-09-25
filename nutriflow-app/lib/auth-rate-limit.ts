/**
 * Authentication-specific rate limiting
 * Protects against brute force attacks on login endpoints
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lockedUntil?: number; // Account lockout timestamp
}

// Store rate limits in memory (use Redis in production for distributed systems)
const authRateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const LOGIN_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5; // Max attempts per window
const ACCOUNT_LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes lockout

/**
 * Check if a login attempt is allowed for the given identifier (email or IP)
 */
export function checkAuthRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  lockedUntil?: number;
} {
  const now = Date.now();
  const entry = authRateLimitStore.get(identifier);

  // No previous attempts or window expired
  if (!entry || now > entry.resetTime) {
    return {
      allowed: true,
      remaining: MAX_LOGIN_ATTEMPTS - 1,
      resetTime: now + LOGIN_WINDOW,
    };
  }

  // Check if account is locked
  if (entry.lockedUntil && now < entry.lockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      lockedUntil: entry.lockedUntil,
    };
  }

  // Lockout expired, reset
  if (entry.lockedUntil && now >= entry.lockedUntil) {
    return {
      allowed: true,
      remaining: MAX_LOGIN_ATTEMPTS - 1,
      resetTime: now + LOGIN_WINDOW,
    };
  }

  // Within window, check count
  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    // Lock the account
    const lockedUntil = now + ACCOUNT_LOCKOUT_DURATION;
    authRateLimitStore.set(identifier, {
      ...entry,
      lockedUntil,
    });

    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      lockedUntil,
    };
  }

  // Increment counter
  const newCount = entry.count + 1;
  authRateLimitStore.set(identifier, {
    ...entry,
    count: newCount,
  });

  return {
    allowed: true,
    remaining: MAX_LOGIN_ATTEMPTS - newCount,
    resetTime: entry.resetTime,
  };
}

/**
 * Record a failed login attempt
 */
export function recordFailedLogin(identifier: string): void {
  const now = Date.now();
  const entry = authRateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First attempt in new window
    authRateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + LOGIN_WINDOW,
    });
  } else {
    // Increment failed attempts
    const newCount = entry.count + 1;
    authRateLimitStore.set(identifier, {
      ...entry,
      count: newCount,
    });

    // Lock account if max attempts reached
    if (newCount >= MAX_LOGIN_ATTEMPTS) {
      const lockedUntil = now + ACCOUNT_LOCKOUT_DURATION;
      authRateLimitStore.set(identifier, {
        ...entry,
        count: newCount,
        lockedUntil,
      });
    }
  }
}

/**
 * Reset rate limit for a successful login
 */
export function resetAuthRateLimit(identifier: string): void {
  authRateLimitStore.delete(identifier);
}

/**
 * Get remaining attempts for an identifier
 */
export function getAuthRateLimitInfo(identifier: string): {
  remaining: number;
  resetTime: number;
  isLocked: boolean;
  lockedUntil?: number;
} {
  const now = Date.now();
  const entry = authRateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    return {
      remaining: MAX_LOGIN_ATTEMPTS,
      resetTime: now + LOGIN_WINDOW,
      isLocked: false,
    };
  }

  const isLocked = !!(entry.lockedUntil && now < entry.lockedUntil);

  return {
    remaining: Math.max(0, MAX_LOGIN_ATTEMPTS - entry.count),
    resetTime: entry.resetTime,
    isLocked,
    lockedUntil: entry.lockedUntil,
  };
}

/**
 * Clean up expired entries (run periodically in production)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of authRateLimitStore.entries()) {
    if (now > entry.resetTime && (!entry.lockedUntil || now > entry.lockedUntil)) {
      authRateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof global !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}
