import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeMode, BrandTheme, AccessibilityMode } from './types';
import { defaultTheme } from './themes/default';
import { brandThemes } from './themes/brand-themes';

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  brandTheme: BrandTheme | null;
  accessibilityMode: AccessibilityMode;
  setThemeMode: (mode: ThemeMode) => void;
  setBrandTheme: (brandId: string | null) => void;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
  toggleThemeMode: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'culinaryseoul-theme';
const BRAND_THEME_STORAGE_KEY = 'culinaryseoul-brand-theme';
const ACCESSIBILITY_STORAGE_KEY = 'culinaryseoul-accessibility';

interface BrandThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  defaultBrandId?: string | null;
}

export function BrandThemeProvider({
  children,
  defaultMode = 'system',
  defaultBrandId = null,
}: BrandThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (stored as ThemeMode) || defaultMode;
  });

  const [brandTheme, setBrandThemeState] = useState<BrandTheme | null>(() => {
    const storedBrandId = localStorage.getItem(BRAND_THEME_STORAGE_KEY) || defaultBrandId;
    return storedBrandId ? brandThemes[storedBrandId] || null : null;
  });

  const [accessibilityMode, setAccessibilityModeState] = useState<AccessibilityMode>(() => {
    const stored = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Check system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    return {
      highContrast: prefersHighContrast,
      reducedMotion: prefersReducedMotion,
      focusIndicator: true,
      screenReaderAnnouncements: true,
    };
  });

  // Get current theme based on mode and brand
  const getCurrentTheme = (): Theme => {
    const baseTheme = brandTheme || defaultTheme;
    const effectiveMode = themeMode === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : themeMode;

    return {
      ...baseTheme,
      mode: effectiveMode,
      accessibility: accessibilityMode,
    };
  };

  const [theme, setTheme] = useState<Theme>(getCurrentTheme());

  // Update theme when dependencies change
  useEffect(() => {
    setTheme(getCurrentTheme());
  }, [themeMode, brandTheme, accessibilityMode]);

  // Apply theme classes and CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('high-contrast', 'reduced-motion');

    // Apply theme mode
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    // Apply accessibility classes
    if (theme.accessibility.highContrast) {
      body.classList.add('high-contrast');
    }
    if (theme.accessibility.reducedMotion) {
      body.classList.add('reduced-motion');
    }

    // Apply CSS variables
    const variables = theme.mode === 'dark' ? theme.colors.dark : theme.colors.light;
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply typography variables
    Object.entries(theme.typography).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--typography-${key}-${subKey}`, String(subValue));
        });
      }
    });

    // Apply spacing variables
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply radius variables
    Object.entries(theme.radius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setTheme(getCurrentTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode, brandTheme, accessibilityMode]);

  // Context methods
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    announceThemeChange(`테마 모드가 ${mode === 'dark' ? '다크' : mode === 'light' ? '라이트' : '시스템'}로 변경되었습니다.`);
  };

  const setBrandTheme = (brandId: string | null) => {
    const newBrandTheme = brandId ? brandThemes[brandId] || null : null;
    setBrandThemeState(newBrandTheme);
    
    if (brandId) {
      localStorage.setItem(BRAND_THEME_STORAGE_KEY, brandId);
    } else {
      localStorage.removeItem(BRAND_THEME_STORAGE_KEY);
    }
    
    announceThemeChange(
      newBrandTheme 
        ? `브랜드 테마가 ${newBrandTheme.name}로 변경되었습니다.`
        : '기본 테마로 변경되었습니다.'
    );
  };

  const setAccessibilityMode = (mode: AccessibilityMode) => {
    setAccessibilityModeState(mode);
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(mode));
  };

  const toggleThemeMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setThemeMode(nextMode);
  };

  const toggleHighContrast = () => {
    const newMode = {
      ...accessibilityMode,
      highContrast: !accessibilityMode.highContrast,
    };
    setAccessibilityMode(newMode);
    announceThemeChange(
      `고대비 모드가 ${newMode.highContrast ? '켜졌습니다' : '꺼졌습니다'}.`
    );
  };

  const toggleReducedMotion = () => {
    const newMode = {
      ...accessibilityMode,
      reducedMotion: !accessibilityMode.reducedMotion,
    };
    setAccessibilityMode(newMode);
    announceThemeChange(
      `모션 감소 모드가 ${newMode.reducedMotion ? '켜졌습니다' : '꺼졌습니다'}.`
    );
  };

  // Screen reader announcement helper
  const announceThemeChange = (message: string) => {
    if (!accessibilityMode.screenReaderAnnouncements) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const value: ThemeContextValue = {
    theme,
    themeMode,
    brandTheme,
    accessibilityMode,
    setThemeMode,
    setBrandTheme,
    setAccessibilityMode,
    toggleThemeMode,
    toggleHighContrast,
    toggleReducedMotion,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a BrandThemeProvider');
  }
  return context;
}