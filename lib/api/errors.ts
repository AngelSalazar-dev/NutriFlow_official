/**
 * Error Handler para APIs
 * Centraliza el manejo de errores
 */

interface AppError extends Error {
  code?: string;
  status?: number;
  details?: any;
}

/**
 * Wrap de funciones async para manejo automático de errores
 */
export function asyncHandler<T>(
  fn: (req: any, res: any) => Promise<T>
) {
  return async (req: any, res: any) => {
    try {
      return await fn(req, res);
    } catch (error) {
      console.error('[API Error]', error);
      
      if (isAppError(error)) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.code || 'ERROR',
            status: error.status || 500,
            details: error.details,
          },
        };
      }
      
      return {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          status: 500,
        },
      };
    }
  };
}

/**
 * Crear un error personalizado
 */
export function createError(
  message: string,
  options?: { code?: string; status?: number; details?: any }
): AppError {
  const error = new Error(message) as AppError;
  error.code = options?.code;
  error.status = options?.status;
  error.details = options?.details;
  return error;
}

/**
 * Error de validación
 */
export function ValidationError(message: string, details?: any) {
  return createError(message, { code: 'VALIDATION_ERROR', status: 400, details });
}

/**
 * Error de autenticación
 */
export function UnauthorizedError(message = 'Unauthorized') {
  return createError(message, { code: 'UNAUTHORIZED', status: 401 });
}

/**
 * Error de permisos
 */
export function ForbiddenError(message = 'Forbidden') {
  return createError(message, { code: 'FORBIDDEN', status: 403 });
}

/**
 * Recurso no encontrado
 */
export function NotFoundError(message = 'Resource not found') {
  return createError(message, { code: 'NOT_FOUND', status: 404 });
}

/**
 * Error de servidor
 */
export function ServerError(message = 'Internal server error') {
  return createError(message, { code: 'SERVER_ERROR', status: 500 });
}

function isAppError(error: any): error is AppError {
  return error instanceof Error && 'code' in error;
}
