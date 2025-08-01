import { useContext } from 'react';
import { ThemeContext } from '@/components/theme/BrandThemeProvider';

export { useTheme } from '@/components/theme/BrandThemeProvider';

// Additional theme utilities
export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a BrandThemeProvider');
  }
  
  return {
    mode: context.themeMode,
    setMode: context.setThemeMode,
    toggle: context.toggleThemeMode,
    isDark: context.theme.mode === 'dark',
    isLight: context.theme.mode === 'light',
    isSystem: context.themeMode === 'system',
  };
}

export function useAccessibility() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAccessibility must be used within a BrandThemeProvider');
  }
  
  return {
    accessibility: context.accessibilityMode,
    toggleHighContrast: context.toggleHighContrast,
    toggleReducedMotion: context.toggleReducedMotion,
    isHighContrast: context.accessibilityMode.highContrast,
    isReducedMotion: context.accessibilityMode.reducedMotion,
  };
}

export function useBrandTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useBrandTheme must be used within a BrandThemeProvider');
  }
  
  return {
    brandTheme: context.brandTheme,
    setBrandTheme: context.setBrandTheme,
    currentBrand: context.brandTheme?.brandId || null,
    brandName: context.brandTheme?.brandName || '기본',
  };
}

export function useThemeColors() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeColors must be used within a BrandThemeProvider');
  }
  
  const colors = context.theme.mode === 'dark' 
    ? context.theme.colors.dark 
    : context.theme.colors.light;
  
  return colors;
}

export function useThemeValue<T>(lightValue: T, darkValue: T): T {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeValue must be used within a BrandThemeProvider');
  }
  
  return context.theme.mode === 'dark' ? darkValue : lightValue;
}