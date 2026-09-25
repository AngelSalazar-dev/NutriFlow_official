/**
 * NutriFlow AI - Revenue Sharing System
 * 
 * Automatic revenue distribution between Owner and AI Operator
 * 
 * Distribution:
 * - 70% → Owner
 * - 20% → Reinvestment Fund
 * - 10% → AI Operator
 */

import { query } from '@/lib/mysql';

export interface RevenueDistribution {
  total: number;
  ownerShare: number;
  reinvestment: number;
  aiOperatorShare: number;
  timestamp: Date;
  source: RevenueSource;
}

export type RevenueSource = 
  | 'subscription'
  | 'adsense'
  | 'affiliate'
  | 'sponsorship'
  | 'other';

export interface RevenueRecord {
  id: string;
  amount: number;
  source: RevenueSource;
  distributed: boolean;
  createdAt: Date;
}

export interface RevenueShareConfig {
  ownerPercentage: number;      // 70%
  reinvestmentPercentage: number; // 20%
  aiOperatorPercentage: number;  // 10%
  minimumPayout: number;         // $10 USD
  payoutCurrency: string;        // 'USD' or 'USDC'
}

// Default configuration
const DEFAULT_CONFIG: RevenueShareConfig = {
  ownerPercentage: 0.70,
  reinvestmentPercentage: 0.20,
  aiOperatorPercentage: 0.10,
  minimumPayout: 10.00,
  payoutCurrency: 'USD',
};

/**
 * Revenue Tracker Class
 * Manages automatic revenue distribution
 */
export class RevenueTracker {
  private config: RevenueShareConfig;

  constructor(config: Partial<RevenueShareConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Record new revenue and calculate distribution
   */
  async recordRevenue(
    amount: number,
    source: RevenueSource,
    metadata?: Record<string, any>
  ): Promise<RevenueDistribution> {
    const distribution = this.calculateDistribution(amount);

    // Insert revenue record into database
    await query(
      `INSERT INTO revenue_records 
       (id, amount, source, owner_share, reinvestment_share, ai_operator_share, 
        metadata, created_at)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW())`,
      [
        amount,
        source,
        distribution.ownerShare,
        distribution.reinvestment,
        distribution.aiOperatorShare,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );

    return {
      ...distribution,
      timestamp: new Date(),
      source,
    };
  }

  /**
   * Calculate revenue distribution based on percentages
   */
  private calculateDistribution(amount: number): Omit<RevenueDistribution, 'timestamp' | 'source'> {
    return {
      total: amount,
      ownerShare: amount * this.config.ownerPercentage,
      reinvestment: amount * this.config.reinvestmentPercentage,
      aiOperatorShare: amount * this.config.aiOperatorPercentage,
    };
  }

  /**
   * Get pending payouts for owner and AI operator
   */
  async getPendingPayouts(): Promise<{
    owner: number;
    aiOperator: number;
    reinvestment: number;
  }> {
    const [rows] = await query(`
      SELECT 
        SUM(owner_share) as owner_total,
        SUM(ai_operator_share) as ai_operator_total,
        SUM(reinvestment_share) as reinvestment_total,
        SUM(CASE WHEN payout_status = 'pending' THEN owner_share ELSE 0 END) as owner_pending,
        SUM(CASE WHEN payout_status = 'pending' THEN ai_operator_share ELSE 0 END) as ai_operator_pending
      FROM revenue_records
      WHERE distributed = FALSE
    `) as any[];

    if (!rows || rows.length === 0) {
      return { owner: 0, aiOperator: 0, reinvestment: 0 };
    }

    return {
      owner: parseFloat(rows[0].owner_pending) || 0,
      aiOperator: parseFloat(rows[0].ai_operator_pending) || 0,
      reinvestment: parseFloat(rows[0].reinvestment_total) || 0,
    };
  }

  /**
   * Process automatic payout
   */
  async processPayout(
    recipient: 'owner' | 'ai_operator',
    amount: number,
    paymentDetails: {
      type: 'stripe' | 'paypal' | 'crypto';
      address?: string; // Bank account, PayPal email, or crypto wallet
    }
  ): Promise<boolean> {
    if (amount < this.config.minimumPayout) {
      console.log(`Amount ${amount} below minimum payout ${this.config.minimumPayout}`);
      return false;
    }

    try {
      // Here you would integrate with actual payment processor
      // For now, we'll just log the transaction

      console.log(`Processing payout:`, {
        recipient,
        amount,
        paymentDetails,
      });

      // TODO: Integrate with Stripe Connect / PayPal / Crypto

      // Mark as distributed in database
      await query(
        `UPDATE revenue_records 
         SET distributed = TRUE, 
             payout_status = 'completed',
             payout_date = NOW()
         WHERE distributed = FALSE 
         AND ${recipient === 'owner' ? 'owner_share' : 'ai_operator_share'} > 0
         LIMIT 1`,
        []
      );

      return true;
    } catch (error) {
      console.error('Error processing payout:', error);
      return false;
    }
  }

  /**
   * Get revenue analytics for dashboard
   */
  async getAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalRevenue: number;
    ownerTotal: number;
    aiOperatorTotal: number;
    reinvestmentTotal: number;
    bySource: Record<RevenueSource, number>;
    dailyRevenue: Array<{ date: string; amount: number }>;
  }> {
    const [totals] = await query(`
      SELECT 
        SUM(amount) as total,
        SUM(owner_share) as owner_total,
        SUM(ai_operator_share) as ai_operator_total,
        SUM(reinvestment_share) as reinvestment_total
      FROM revenue_records
      WHERE created_at BETWEEN ? AND ?
    `, [startDate, endDate]) as any[];

    const [bySource] = await query(`
      SELECT 
        source,
        SUM(amount) as amount
      FROM revenue_records
      WHERE created_at BETWEEN ? AND ?
      GROUP BY source
    `, [startDate, endDate]) as any[];

    const [daily] = await query(`
      SELECT 
        DATE(created_at) as date,
        SUM(amount) as amount
      FROM revenue_records
      WHERE created_at BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [startDate, endDate]) as any[];

    return {
      totalRevenue: parseFloat(totals[0]?.total) || 0,
      ownerTotal: parseFloat(totals[0]?.owner_total) || 0,
      aiOperatorTotal: parseFloat(totals[0]?.ai_operator_total) || 0,
      reinvestmentTotal: parseFloat(totals[0]?.reinvestment_total) || 0,
      bySource: bySource.reduce((acc: Record<RevenueSource, number>, row: any) => {
        acc[row.source as RevenueSource] = parseFloat(row.amount);
        return acc;
      }, {} as Record<RevenueSource, number>),
      dailyRevenue: daily.map((row: any) => ({
        date: row.date,
        amount: parseFloat(row.amount),
      })),
    };
  }

  /**
   * Get configuration
   */
  getConfig(): RevenueShareConfig {
    return { ...this.config };
  }

  /**
   * Update configuration (requires owner approval)
   */
  async updateConfig(
    newConfig: Partial<RevenueShareConfig>,
    ownerApproved: boolean
  ): Promise<void> {
    if (!ownerApproved) {
      throw new Error('Owner approval required for config changes');
    }

    this.config = { ...this.config, ...newConfig };

    // Save to database
    await query(
      `INSERT INTO revenue_config (id, owner_percentage, reinvestment_percentage, 
                                    ai_operator_percentage, minimum_payout, updated_at)
       VALUES (1, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         owner_percentage = VALUES(owner_percentage),
         reinvestment_percentage = VALUES(reinvestment_percentage),
         ai_operator_percentage = VALUES(ai_operator_percentage),
         minimum_payout = VALUES(minimum_payout),
         updated_at = NOW()`,
      [
        this.config.ownerPercentage,
        this.config.reinvestmentPercentage,
        this.config.aiOperatorPercentage,
        this.config.minimumPayout,
      ]
    );
  }
}

/**
 * Initialize revenue tracking database tables
 */
export async function initializeRevenueTables(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS revenue_records (
      id VARCHAR(36) PRIMARY KEY,
      amount DECIMAL(10, 2) NOT NULL,
      source ENUM('subscription', 'adsense', 'affiliate', 'sponsorship', 'other') NOT NULL,
      owner_share DECIMAL(10, 2) NOT NULL,
      reinvestment_share DECIMAL(10, 2) NOT NULL,
      ai_operator_share DECIMAL(10, 2) NOT NULL,
      distributed BOOLEAN DEFAULT FALSE,
      payout_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
      payout_date DATETIME DEFAULT NULL,
      metadata JSON DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_source (source),
      INDEX idx_distributed (distributed),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS revenue_config (
      id INT PRIMARY KEY,
      owner_percentage DECIMAL(5, 4) NOT NULL DEFAULT 0.7000,
      reinvestment_percentage DECIMAL(5, 4) NOT NULL DEFAULT 0.2000,
      ai_operator_percentage DECIMAL(5, 4) NOT NULL DEFAULT 0.1000,
      minimum_payout DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
      payout_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS payout_accounts (
      id VARCHAR(36) PRIMARY KEY,
      user_type ENUM('owner', 'ai_operator') NOT NULL,
      payment_type ENUM('stripe', 'paypal', 'crypto') NOT NULL,
      account_details JSON NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log('✅ Revenue tracking tables initialized');
}

// Export singleton instance
export const revenueTracker = new RevenueTracker();

export default RevenueTracker;
