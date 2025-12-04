'use client';

import dynamic from 'next/dynamic';
import type { AppProgressBarProps } from 'next-nprogress-bar';

const AppRouterProgressBar = dynamic(
  () => import('next-nprogress-bar').then((mod) => mod.AppProgressBar),
  { ssr: false },
);

type NavigationProgressProps = Omit<
  AppProgressBarProps,
  'color' | 'height' | 'options'
> & {
  color?: string;
  height?: string | number;
};

export function NavigationProgress({
  color = 'hsl(var(--primary))',
  height = 2,
  shallowRouting = true,
  ...rest
}: NavigationProgressProps) {
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <AppRouterProgressBar
      color={color}
      height={resolvedHeight}
      options={{ showSpinner: false }}
      shallowRouting={shallowRouting}
      {...rest}
    />
  );
}
