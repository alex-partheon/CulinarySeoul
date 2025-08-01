export type ThemeMode = 'light' | 'dark' | 'system';

export interface ColorPalette {
  // Base colors
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  popover: string;
  'popover-foreground': string;
  
  // Brand colors
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  accent: string;
  'accent-foreground': string;
  
  // Semantic colors
  muted: string;
  'muted-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  
  // Interface colors
  border: string;
  input: string;
  ring: string;
  
  // Chart colors
  'chart-1': string;
  'chart-2': string;
  'chart-3': string;
  'chart-4': string;
  'chart-5': string;
  
  // Sidebar colors
  sidebar: string;
  'sidebar-foreground': string;
  'sidebar-primary': string;
  'sidebar-primary-foreground': string;
  'sidebar-accent': string;
  'sidebar-accent-foreground': string;
  'sidebar-border': string;
  'sidebar-ring': string;
}

export interface Typography {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

export interface Spacing {
  px: string;
  0: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

export interface BorderRadius {
  none: string;
  sm: string;
  DEFAULT: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface AccessibilityMode {
  highContrast: boolean;
  reducedMotion: boolean;
  focusIndicator: boolean;
  screenReaderAnnouncements: boolean;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    light: ColorPalette;
    dark: ColorPalette;
  };
  typography: Typography;
  spacing: Spacing;
  radius: BorderRadius;
  mode: 'light' | 'dark';
  accessibility: AccessibilityMode;
}

export interface BrandTheme extends Omit<Theme, 'mode' | 'accessibility'> {
  brandId: string;
  brandName: string;
}