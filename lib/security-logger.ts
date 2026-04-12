/**
 * Security Logging Utility for NutriFlow
 * Follows best practices for audit logs (Inmutable, Descriptive, Sanitized)
 */

type SecurityEventType = 
  | 'AUTH_LOGIN_SUCCESS' 
  | 'AUTH_LOGIN_FAILURE' 
  | 'AUTH_REGISTER' 
  | 'DATA_ACCESS' 
  | 'SENSITIVE_CHANGE' 
  | 'RATE_LIMIT_EXCEEDED';

interface LogDetails {
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  metadata?: Record<string, any>;
}

/**
 * Logs a security event to the console (and potentially to an external service)
 */
export function logSecurityEvent(
  event: SecurityEventType,
  details: LogDetails
): void {
  const timestamp = new Date().toISOString();
  
  // Sanitize email to avoid accidental PII exposure in logs (optional, depends on policy)
  const sanitizedEmail = details.email ? details.email.replace(/(.{3})(.*)(?=@)/, '$1***') : undefined;

  const logEntry = {
    timestamp,
    event,
    ...details,
    email: sanitizedEmail, // Use partially masked email for logs
  };

  // In production, this should be sent to a centralized logging service (e.g. Datadog, CloudWatch, Sentry)
  console.log(`[SECURITY_AUDIT] ${JSON.stringify(logEntry)}`);
  
  // Example of integration with Sentry/Monitoring
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureMessage(`Security Event: ${event}`, { extra: logEntry });
  }
}
