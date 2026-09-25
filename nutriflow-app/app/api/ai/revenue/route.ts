import { NextRequest, NextResponse } from 'next/server';
import { revenueTracker, RevenueDistribution, RevenueSource } from '@/lib/revenue-tracker';

/**
 * GET /api/ai/revenue
 * Get revenue analytics and config
 */
export async function GET(request: NextRequest) {
  try {
    // Verify AI agent authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !isValidAIAgent(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'analytics';
    const days = parseInt(searchParams.get('days') || '30');

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (action === 'config') {
      const config = revenueTracker.getConfig();
      return NextResponse.json({
        success: true,
        config,
      });
    }

    // Default: analytics
    const analytics = await revenueTracker.getAnalytics(startDate, endDate);
    const pendingPayouts = await revenueTracker.getPendingPayouts();

    return NextResponse.json({
      success: true,
      analytics,
      pendingPayouts,
      config: revenueTracker.getConfig(),
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    return NextResponse.json(
      { error: 'Error getting analytics' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/revenue
 * Record revenue or process payout
 */
export async function POST(request: NextRequest) {
  try {
    // Verify AI agent authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !isValidAIAgent(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, amount, source, metadata, recipient, paymentDetails } = body;

    // Record revenue
    if (action === 'record' || (!action && source)) {
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json(
          { error: 'Invalid amount' },
          { status: 400 }
        );
      }

      if (!source || !['subscription', 'adsense', 'affiliate', 'sponsorship', 'other'].includes(source)) {
        return NextResponse.json(
          { error: 'Invalid revenue source' },
          { status: 400 }
        );
      }

      // Record revenue and calculate distribution
      const distribution: RevenueDistribution = await revenueTracker.recordRevenue(
        amount,
        source as RevenueSource,
        metadata
      );

      return NextResponse.json({
        success: true,
        distribution,
        message: `Revenue recorded: $${amount} → Owner: $${distribution.ownerShare.toFixed(2)}, AI: $${distribution.aiOperatorShare.toFixed(2)}`,
      });
    }

    // Process payout
    if (action === 'payout' || recipient) {
      if (!recipient || !['owner', 'ai_operator'].includes(recipient)) {
        return NextResponse.json(
          { error: 'Invalid recipient' },
          { status: 400 }
        );
      }

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json(
          { error: 'Invalid amount' },
          { status: 400 }
        );
      }

      if (!paymentDetails || !paymentDetails.type) {
        return NextResponse.json(
          { error: 'Payment details required' },
          { status: 400 }
        );
      }

      // Process payout
      const success = await revenueTracker.processPayout(
        recipient as 'owner' | 'ai_operator',
        amount,
        paymentDetails
      );

      if (success) {
        return NextResponse.json({
          success: true,
          message: `Payout of $${amount} to ${recipient} processed successfully`,
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to process payout' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}

// Helper function to validate AI agent authorization
function isValidAIAgent(authHeader: string): boolean {
  // In production, verify API key or JWT token
  const apiKey = authHeader.replace('Bearer ', '');

  // Check against environment variable
  const validApiKey = process.env.AI_AGENT_API_KEY;

  if (!validApiKey) {
    console.warn('AI_AGENT_API_KEY not configured');
    return false;
  }

  return apiKey === validApiKey;
}
