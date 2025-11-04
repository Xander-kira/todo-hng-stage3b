// lib/theme.ts

const base = {
  shapes: {
    radius: 12,
    itemPaddingY: 14,
  },
  hero: {
    // Figma gradient tokens (light & dark)
    light: ['#5598FF', '#AC2DEB'],
    dark: ['#3710BD', '#A42395'],
  },
};

export const lightTheme = {
  ...base,
  hero: { ...base.hero, gradient: base.hero.light },
  colors: {
    bg: '#F7F7F9',
    card: '#FFFFFF',
    text: '#0F172A',
    sub: '#475569',
    primary: '#6366F1',
    border: '#E2E8F0',
    accent: '#22C55E',
    danger: '#EF4444',
    muted: '#94A3B8',
  },
};

export const darkTheme = {
  ...base,
  hero: { ...base.hero, gradient: base.hero.dark },
  colors: {
    bg: '#0B1020',
    card: '#111827',
    text: '#E5E7EB',
    sub: '#9CA3AF',
    primary: '#8B5CF6',
    border: '#1F2937',
    accent: '#10B981',
    danger: '#F87171',
    muted: '#6B7280',
  },
};

export type Theme = typeof lightTheme;
import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
