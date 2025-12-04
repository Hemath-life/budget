'use client';

import type { AppProgressBarProps } from 'next-nprogress-bar';
import dynamic from 'next/dynamic';

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
  return (
    <AppRouterProgressBar
      color={color}
      height={height}
      options={{ showSpinner: false }}
      shallowRouting={shallowRouting}
      {...rest}
    />
  );
}
