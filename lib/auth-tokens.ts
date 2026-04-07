/**
 * Token utilities for email verification and password reset
 */

import { query } from './mysql';
import crypto from 'crypto';

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 64): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Create an email verification token for a user
 */
export async function createEmailVerificationToken(userId: string): Promise<string> {
  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Delete any existing unused tokens for this user
  await query(
    'DELETE FROM email_verification_tokens WHERE user_id = ? AND used = FALSE',
    [userId]
  );

  // Insert new token
  await query(
    `INSERT INTO email_verification_tokens (id, user_id, token, expires_at) 
     VALUES (UUID(), ?, ?, ?)`,
    [userId, token, expiresAt]
  );

  return token;
}

/**
 * Verify an email verification token
 */
export async function verifyEmailToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const result = await query(
      `SELECT user_id, expires_at, used 
       FROM email_verification_tokens 
       WHERE token = ?`,
      [token]
    );

    const rows = Array.isArray(result) ? result[0] : result;
    const tokens = Array.isArray(rows) ? rows : [rows];

    if (tokens.length === 0) {
      return { success: false, error: 'Token inválido' };
    }

    const tokenData = tokens[0] as any;

    // Check if token was already used
    if (tokenData.used) {
      return { success: false, error: 'Token ya fue utilizado' };
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return { success: false, error: 'Token expirado' };
    }

    // Mark as used
    await query(
      'UPDATE email_verification_tokens SET used = TRUE WHERE token = ?',
      [token]
    );

    // Mark user as verified
    await query(
      'UPDATE users SET email_verified = TRUE, email_verified_at = NOW() WHERE id = ?',
      [tokenData.user_id]
    );

    return { success: true, userId: tokenData.user_id };
  } catch (error: any) {
    console.error('Error verifying email token:', error);
    return { success: false, error: 'Error al verificar token' };
  }
}

/**
 * Create a password reset token for a user
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Delete any existing unused tokens for this user
  await query(
    'DELETE FROM password_reset_tokens WHERE user_id = ? AND used = FALSE',
    [userId]
  );

  // Insert new token
  await query(
    `INSERT INTO password_reset_tokens (id, user_id, token, expires_at) 
     VALUES (UUID(), ?, ?, ?)`,
    [userId, token, expiresAt]
  );

  return token;
}

/**
 * Verify a password reset token
 */
export async function verifyPasswordResetToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const result = await query(
      `SELECT user_id, expires_at, used 
       FROM password_reset_tokens 
       WHERE token = ?`,
      [token]
    );

    const rows = Array.isArray(result) ? result[0] : result;
    const tokens = Array.isArray(rows) ? rows : [rows];

    if (tokens.length === 0) {
      return { success: false, error: 'Token inválido' };
    }

    const tokenData = tokens[0] as any;

    // Check if token was already used
    if (tokenData.used) {
      return { success: false, error: 'Token ya fue utilizado' };
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return { success: false, error: 'Token expirado' };
    }

    return { success: true, userId: tokenData.user_id };
  } catch (error: any) {
    console.error('Error verifying password reset token:', error);
    return { success: false, error: 'Error al verificar token' };
  }
}

/**
 * Use a password reset token (mark as used)
 */
export async function usePasswordResetToken(token: string): Promise<void> {
  await query(
    'UPDATE password_reset_tokens SET used = TRUE WHERE token = ?',
    [token]
  );
}

/**
 * Get user's email verification status
 */
export async function getEmailVerificationStatus(userId: string): Promise<{ verified: boolean; hasToken: boolean }> {
  try {
    // Get user verification status
    const userResult = await query(
      'SELECT email_verified FROM users WHERE id = ?',
      [userId]
    );

    const userRows = Array.isArray(userResult) ? userResult[0] : userResult;
    const users = Array.isArray(userRows) ? userRows : [userRows];

    if (users.length === 0) {
      return { verified: false, hasToken: false };
    }

    const isVerified = users[0].email_verified;

    // Check if user has an unused, non-expired token
    const tokenResult = await query(
      `SELECT COUNT(*) as count 
       FROM email_verification_tokens 
       WHERE user_id = ? AND used = FALSE AND expires_at > NOW()`,
      [userId]
    );

    const tokenRows = Array.isArray(tokenResult) ? tokenResult[0] : tokenResult;
    const tokenRowsArr = Array.isArray(tokenRows) ? tokenRows : [tokenRows];
    const hasValidToken = tokenRowsArr[0]?.count > 0;

    return { verified: isVerified, hasToken: hasValidToken };
  } catch (error) {
    console.error('Error getting email verification status:', error);
    return { verified: false, hasToken: false };
  }
}
