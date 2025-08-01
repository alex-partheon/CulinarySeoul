import React from 'react';
import { useTheme, useThemeMode, useAccessibility, useBrandTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Monitor, Moon, Sun, Palette, Eye, Move } from 'lucide-react';
import { brandThemes } from './themes/brand-themes';

export function ThemeSelector() {
  const { theme } = useTheme();
  const { mode, setMode, isDark, isLight, isSystem } = useThemeMode();
  const { accessibility, toggleHighContrast, toggleReducedMotion } = useAccessibility();
  const { brandTheme, setBrandTheme, currentBrand } = useBrandTheme();

  const getModeIcon = () => {
    if (isSystem) return <Monitor className="h-4 w-4" />;
    if (isDark) return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  const getModeLabel = () => {
    if (isSystem) return '시스템';
    if (isDark) return '다크';
    return '라이트';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="테마 설정">
          {getModeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>테마 설정</DropdownMenuLabel>
        
        {/* Theme Mode Selection */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">모드</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setMode('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>라이트</span>
          {isLight && !isSystem && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>다크</span>
          {isDark && !isSystem && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>시스템</span>
          {isSystem && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>

        {/* Brand Theme Selection */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">브랜드 테마</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setBrandTheme(null)}>
          <Palette className="mr-2 h-4 w-4" />
          <span>기본</span>
          {!currentBrand && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        {Object.entries(brandThemes).map(([id, brandTheme]) => (
          <DropdownMenuItem key={id} onClick={() => setBrandTheme(id)}>
            <div
              className="mr-2 h-4 w-4 rounded-full border"
              style={{
                backgroundColor: brandTheme.colors.light.primary,
              }}
            />
            <span>{brandTheme.brandName}</span>
            {currentBrand === id && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}

        {/* Accessibility Options */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">접근성</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={accessibility.highContrast}
          onCheckedChange={toggleHighContrast}
        >
          <Eye className="mr-2 h-4 w-4" />
          <span>고대비 모드</span>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={accessibility.reducedMotion}
          onCheckedChange={toggleReducedMotion}
        >
          <Move className="mr-2 h-4 w-4" />
          <span>모션 감소</span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}