'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/apps/components/ui/button';
import { Switch } from '@/apps/components/ui/switch';
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
    <section id="pricing" className="py-20 bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white">
            Simple pricing
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Choose the plan that fits your needs. All plans come with a 14-day free trial.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm ${!isYearly ? 'text-black dark:text-white font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-green-500"
            />
            <span className={`text-sm ${isYearly ? 'text-black dark:text-white font-medium' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const savings = getYearlySavings(plan);
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 ${
                  isPopular 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center pt-2">
                  <h3 className="text-lg font-semibold text-black dark:text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold text-black dark:text-white">Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-black dark:text-white">
                          {formatPrice(plan.price)}
                        </span>
                        <span className="text-sm text-gray-500">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      </>
                    )}
                  </div>
                  {savings > 0 && isYearly && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Save {formatPrice(savings)}/year
                    </p>
                  )}
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href="/signup">
                    <Button
                      className={`w-full rounded-full py-5 ${
                        isPopular
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                      }`}
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
          <p className="text-sm text-gray-500">
            30-day money-back guarantee • No credit card required for free trial
          </p>
        </div>
      </div>
    </section>
  );
}
