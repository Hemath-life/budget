import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { PLANS, getPlanById } from '@/lib/plans';

// GET subscription for user
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';

    const subscription = db.prepare(`
      SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
    `).get(userId) as Record<string, unknown> | undefined;

    if (!subscription) {
      // Return free plan by default
      const freePlan = PLANS.find(p => p.tier === 'free');
      return NextResponse.json({
        id: null,
        userId,
        planId: 'free',
        plan: freePlan,
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
    }

    const plan = getPlanById(subscription.plan_id as string);

    return NextResponse.json({
      id: subscription.id,
      userId: subscription.user_id,
      planId: subscription.plan_id,
      plan,
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      trialEnd: subscription.trial_end,
      createdAt: subscription.created_at,
      updatedAt: subscription.updated_at,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

// POST create new subscription
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { planId, userId = 'default-user', interval = 'monthly' } = body;

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const id = generateId();
    const now = new Date();
    const periodEnd = new Date(now);
    
    if (interval === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // Cancel existing subscription if any
    db.prepare(`
      UPDATE subscriptions 
      SET status = 'cancelled', updated_at = ?
      WHERE user_id = ? AND status = 'active'
    `).run(now.toISOString(), userId);

    // Create new subscription
    const stmt = db.prepare(`
      INSERT INTO subscriptions (
        id, user_id, plan_id, status, 
        current_period_start, current_period_end,
        cancel_at_period_end, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      userId,
      planId,
      'active',
      now.toISOString(),
      periodEnd.toISOString(),
      0,
      now.toISOString(),
      now.toISOString()
    );

    const subscription = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(id) as Record<string, unknown> | undefined;

    return NextResponse.json({
      ...(subscription ?? {}),
      plan,
      message: 'Subscription created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

// PUT update subscription (upgrade/downgrade)
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { planId, userId = 'default-user' } = body;

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const now = new Date();
    const periodEnd = new Date(now);
    
    if (plan.interval === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    db.prepare(`
      UPDATE subscriptions 
      SET plan_id = ?, current_period_start = ?, current_period_end = ?, updated_at = ?
      WHERE user_id = ? AND status = 'active'
    `).run(planId, now.toISOString(), periodEnd.toISOString(), now.toISOString(), userId);

    const subscription = db.prepare(`
      SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'
    `).get(userId) as Record<string, unknown> | undefined;

    return NextResponse.json({
      ...(subscription ?? {}),
      plan,
      message: 'Subscription updated successfully',
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}

// DELETE cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE subscriptions 
      SET cancel_at_period_end = 1, updated_at = ?
      WHERE user_id = ? AND status = 'active'
    `).run(now, userId);

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription will be cancelled at the end of the billing period' 
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
