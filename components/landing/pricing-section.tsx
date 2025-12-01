'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Check, ArrowRight } from 'lucide-react';
import { PLANS, formatPrice } from '@/lib/plans';
import type { Plan } from '@/lib/types';

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const getPlansForInterval = () => {
    const interval = isYearly ? 'yearly' : 'monthly';
    const freePlan = PLANS.find(p => p.tier === 'free');
    const proPlan = PLANS.find(p => p.tier === 'pro' && p.interval === interval);
    const premiumPlan = PLANS.find(p => p.tier === 'premium' && p.interval === interval);
    return [freePlan, proPlan, premiumPlan].filter(Boolean) as Plan[];
  };

  const plans = getPlansForInterval();

  const getYearlySavings = (plan: Plan) => {
    if (plan.tier === 'free') return 0;
    const monthlyPlan = PLANS.find(p => p.tier === plan.tier && p.interval === 'monthly');
    if (!monthlyPlan) return 0;
    return (monthlyPlan.price * 12) - plan.price;
  };

  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans come with a 14-day free trial.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const savings = getYearlySavings(plan);
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border bg-card p-8 ${
                  isPopular 
                    ? 'border-primary shadow-lg ring-2 ring-primary' 
                    : 'hover:border-primary/50'
                } transition-all`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {savings > 0 && isYearly && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Save {formatPrice(savings)} per year
                    </p>
                  )}
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href="/dashboard">
                    <Button
                      className="w-full"
                      variant={isPopular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.tier === 'free' ? 'Get Started' : 'Start Free Trial'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Money back guarantee */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            💰 30-day money-back guarantee • No credit card required for free trial
          </p>
        </div>
      </div>
    </section>
  );
}
