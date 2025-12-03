import React from 'react';
import { TopBar } from '../top-bar';
import { type TopBarProps } from '../../components/types';

// Floating variant with default styling
export const FloatingTopBar: React.FC<TopBarProps> = (props) => {
  return (
    <TopBar
      variant="fixed"
      position="top"
      rounded={true}
      bordered={true}
      blur={true}
      className="top-6 inset-x-4 bg-background/80 backdrop-blur-sm border border-border max-w-screen-xl mx-auto rounded-full"
      {...props}
    />
  );
};

// Sticky variant
export const StickyTopBar: React.FC<TopBarProps> = (props) => {
  return (
    <TopBar
      variant="sticky"
      position="top"
      rounded={false}
      bordered={true}
      blur={false}
      className="top-0 inset-x-0 bg-background border-b border-border"
      {...props}
    />
  );
};

// Static variant
export const StaticTopBar: React.FC<TopBarProps> = (props) => {
  return (
    <TopBar
      variant="static"
      position="top"
      rounded={false}
      bordered={false}
      blur={false}
      className="relative inset-x-0 bg-transparent"
      {...props}
    />
  );
};

// Glass/Blur variant
export const GlassTopBar: React.FC<TopBarProps> = (props) => {
  return (
    <TopBar
      variant="fixed"
      position="top"
      rounded={true}
      bordered={true}
      blur={true}
      shadow={true}
      className="top-4 inset-x-4 bg-background/60 backdrop-blur-md border border-white/20 shadow-lg max-w-screen-xl mx-auto rounded-2xl"
      {...props}
    />
  );
};
