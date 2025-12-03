export type Theme = 'light' | 'dark' | 'system' | 'monday' | 'blue' | 'royal' | 'emerald' | 'stone' | 'gray' | 'slate';

export const AVAILABLE_THEMES = [
  { 
    value: 'light' as const, 
    label: 'Light', 
    description: 'Clean and bright interface' 
  },
  { 
    value: 'dark' as const, 
    label: 'Dark', 
    description: 'Monday-inspired dark mode' 
  },
  { 
    value: 'system' as const, 
    label: 'System', 
    description: 'Follow system preference' 
  },
  { 
    value: 'monday' as const, 
    label: 'Monday', 
    description: 'Bright Monday.com inspired theme' 
  },
  { 
    value: 'blue' as const, 
    label: 'Blue', 
    description: 'Deep blue UI with high contrast' 
  },
  { 
    value: 'royal' as const, 
    label: 'Royal', 
    description: 'Regal blue base with golden accents' 
  },
  { 
    value: 'emerald' as const, 
    label: 'Emerald', 
    description: 'Calming green base theme' 
  },
  { 
    value: 'stone' as const, 
    label: 'Stone', 
    description: 'Warm neutral tones from shadcn' 
  },
  { 
    value: 'gray' as const, 
    label: 'Gray', 
    description: 'Balanced neutral base from shadcn' 
  },
  { 
    value: 'slate' as const, 
    label: 'Slate', 
    description: 'Cool neutral base from shadcn' 
  },
] as const;

export const COLOR_THEMES = AVAILABLE_THEMES.filter(
  theme => !['light', 'dark', 'system'].includes(theme.value)
);

export const BASE_THEMES = AVAILABLE_THEMES.filter(
  theme => ['light', 'dark', 'system'].includes(theme.value)
);

export const SHADCN_THEMES = AVAILABLE_THEMES.filter(
  theme => ['stone', 'gray', 'slate'].includes(theme.value)
);

export const MONDAY_THEMES = AVAILABLE_THEMES.filter(
  theme => ['monday'].includes(theme.value)
);
