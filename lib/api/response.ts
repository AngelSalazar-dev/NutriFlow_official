import { NextResponse } from 'next/server';

interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

interface ApiSuccess<T> {
  data: T;
  message?: string;
}

/**
 * Helper para respuestas de API exitosas
 */
export function successResponse<T>(data: T, message?: string, status = 200) {
  const response: ApiSuccess<T> = { data };
  if (message) response.message = message;
  
  return NextResponse.json(response, { status });
}

/**
 * Helper para respuestas de API con error
 */
export function errorResponse(error: string | ApiError, status = 400, headers?: Record<string, string>) {
  const response: ApiError = typeof error === 'string'
    ? { message: error }
    : error;

  return NextResponse.json(response, {
    status,
    headers: headers as any,
  });
}

/**
 * Helper para errores de servidor
 */
export function serverError(message = 'Internal server error') {
  console.error('[API Error]', message);
  return errorResponse(message, 500);
}

/**
 * Helper para errores de validación
 */
export function validationError(message: string, details?: any) {
  return errorResponse({ message, code: 'VALIDATION_ERROR', details }, 400);
}

/**
 * Helper para errores de autenticación
 */
export function unauthorizedError(message = 'Unauthorized') {
  return errorResponse({ message, code: 'UNAUTHORIZED' }, 401);
}

/**
 * Helper para errores de permisos
 */
export function forbiddenError(message = 'Forbidden') {
  return errorResponse({ message, code: 'FORBIDDEN' }, 403);
}

/**
 * Helper para recursos no encontrados
 */
export function notFoundError(message = 'Resource not found') {
  return errorResponse({ message, code: 'NOT_FOUND' }, 404);
}

/**
 * Helper para rate limiting
 */
export function rateLimitError(message = 'Too many requests', retryAfter?: number) {
  const headers: Record<string, string> = {};
  if (retryAfter) {
    headers['Retry-After'] = retryAfter.toString();
  }

  return errorResponse({ message, code: 'RATE_LIMITED' }, 429, headers);
}
