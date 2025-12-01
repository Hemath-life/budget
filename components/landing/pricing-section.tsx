'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
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
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-violet-50/30 dark:via-violet-950/10 to-background -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Pricing</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Simple, transparent</span>
            <span className="block">pricing</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans come with a 14-day free trial.
          </p>

          {/* Billing toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-violet-600"
            />
            <span className={`text-sm font-semibold ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
              <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-0.5 text-xs font-bold text-white shadow-lg shadow-green-500/25">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const savings = getYearlySavings(plan);
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border bg-card/50 backdrop-blur-sm p-8 ${
                  isPopular 
                    ? 'border-violet-500 shadow-2xl shadow-violet-500/20 ring-2 ring-violet-500' 
                    : 'hover:border-violet-300 dark:hover:border-violet-700'
                } transition-all duration-500 hover:-translate-y-2`}
              >
                {isPopular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
                      <Sparkles className="h-4 w-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-6 flex items-baseline justify-center gap-2">
                    {plan.price === 0 ? (
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Free</span>
                    ) : (
                      <>
                        <span className="text-5xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                          {formatPrice(plan.price)}
                        </span>
                        <span className="text-muted-foreground font-medium">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      </>
                    )}
                  </div>
                  {savings > 0 && isYearly && (
                    <p className="mt-3 text-sm font-semibold text-green-600 dark:text-green-400">
                      💰 Save {formatPrice(savings)} per year
                    </p>
                  )}
                </div>

                <ul className="mt-10 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10">
                          <Check className="h-4 w-4 text-violet-600 dark:text-violet-400 font-bold" />
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <Link href="/signup">
                    <Button
                      className={`w-full h-12 rounded-2xl text-base font-semibold transition-all ${
                        isPopular
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
                          : 'hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:border-violet-300 dark:hover:border-violet-700'
                      }`}
                      variant={isPopular ? 'default' : 'outline'}
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
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-muted/50 backdrop-blur-sm border px-6 py-3">
            <span className="text-2xl">💰</span>
            <p className="text-sm font-medium text-muted-foreground">
              30-day money-back guarantee • No credit card required for free trial
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
