import { BrandTheme } from '../types';

// 밀랍 (Millab) brand theme - Warm honey/wax colors
const millabTheme: BrandTheme = {
  id: 'millab',
  brandId: 'millab',
  name: '밀랍',
  brandName: '밀랍',
  colors: {
    light: {
      // Base colors
      background: 'hsl(39 20% 98%)',
      foreground: 'hsl(39 40% 10%)',
      card: 'hsl(39 20% 100%)',
      'card-foreground': 'hsl(39 40% 10%)',
      popover: 'hsl(39 20% 100%)',
      'popover-foreground': 'hsl(39 40% 10%)',
      
      // Brand colors - Honey/Wax inspired
      primary: 'hsl(39 90% 50%)', // Golden honey
      'primary-foreground': 'hsl(39 20% 10%)',
      secondary: 'hsl(30 70% 40%)', // Dark amber
      'secondary-foreground': 'hsl(30 20% 98%)',
      accent: 'hsl(45 85% 60%)', // Light honey
      'accent-foreground': 'hsl(45 40% 10%)',
      
      // Semantic colors
      muted: 'hsl(39 15% 95%)',
      'muted-foreground': 'hsl(39 10% 46%)',
      destructive: 'hsl(0 84% 60%)',
      'destructive-foreground': 'hsl(0 0% 100%)',
      
      // Interface colors
      border: 'hsl(39 20% 90%)',
      input: 'hsl(39 20% 90%)',
      ring: 'hsl(39 90% 50% / 0.3)',
      
      // Chart colors - Honey palette
      'chart-1': 'hsl(39 90% 50%)',
      'chart-2': 'hsl(30 70% 40%)',
      'chart-3': 'hsl(45 85% 60%)',
      'chart-4': 'hsl(25 75% 55%)',
      'chart-5': 'hsl(35 80% 45%)',
      
      // Sidebar colors
      sidebar: 'hsl(39 20% 100%)',
      'sidebar-foreground': 'hsl(39 40% 10%)',
      'sidebar-primary': 'hsl(39 90% 50%)',
      'sidebar-primary-foreground': 'hsl(39 20% 10%)',
      'sidebar-accent': 'hsl(45 85% 60%)',
      'sidebar-accent-foreground': 'hsl(45 40% 10%)',
      'sidebar-border': 'hsl(39 20% 90%)',
      'sidebar-ring': 'hsl(39 90% 50% / 0.3)',
    },
    dark: {
      // Base colors - Dark Mode
      background: 'hsl(39 30% 8%)',
      foreground: 'hsl(39 20% 95%)',
      card: 'hsl(39 30% 11%)',
      'card-foreground': 'hsl(39 20% 95%)',
      popover: 'hsl(39 30% 11%)',
      'popover-foreground': 'hsl(39 20% 95%)',
      
      // Brand colors - Dark Mode
      primary: 'hsl(39 85% 65%)', // Lighter golden honey
      'primary-foreground': 'hsl(39 30% 8%)',
      secondary: 'hsl(30 65% 50%)', // Lighter amber
      'secondary-foreground': 'hsl(30 30% 8%)',
      accent: 'hsl(45 80% 70%)', // Pale honey
      'accent-foreground': 'hsl(45 30% 8%)',
      
      // Semantic colors - Dark Mode
      muted: 'hsl(39 25% 18%)',
      'muted-foreground': 'hsl(39 15% 65%)',
      destructive: 'hsl(0 91% 71%)',
      'destructive-foreground': 'hsl(39 30% 8%)',
      
      // Interface colors - Dark Mode
      border: 'hsl(39 25% 18%)',
      input: 'hsl(39 25% 18%)',
      ring: 'hsl(39 85% 65% / 0.3)',
      
      // Chart colors - Dark Mode
      'chart-1': 'hsl(39 85% 65%)',
      'chart-2': 'hsl(30 65% 50%)',
      'chart-3': 'hsl(45 80% 70%)',
      'chart-4': 'hsl(25 70% 60%)',
      'chart-5': 'hsl(35 75% 55%)',
      
      // Sidebar colors - Dark Mode
      sidebar: 'hsl(39 30% 11%)',
      'sidebar-foreground': 'hsl(39 20% 95%)',
      'sidebar-primary': 'hsl(39 85% 65%)',
      'sidebar-primary-foreground': 'hsl(39 30% 8%)',
      'sidebar-accent': 'hsl(45 80% 70%)',
      'sidebar-accent-foreground': 'hsl(45 30% 8%)',
      'sidebar-border': 'hsl(39 25% 18%)',
      'sidebar-ring': 'hsl(39 85% 65% / 0.3)',
    },
  },
  typography: {
    fontFamily: {
      sans: '"DM Sans", "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      serif: '"DM Sans", "Pretendard Variable", Pretendard, serif',
      mono: '"Space Mono", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  radius: {
    none: '0',
    sm: '0.5rem',
    DEFAULT: '0.75rem',
    md: '0.625rem',
    lg: '0.875rem',
    xl: '1rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
};

// Additional brand themes can be added here
// For example: cafeBrand, restaurantBrand, etc.

export const brandThemes: Record<string, BrandTheme> = {
  millab: millabTheme,
  // Add more brand themes as needed
};