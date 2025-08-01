import { useState } from 'react';
import { 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon, 
  Globe,
  Keyboard
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

export function UserProfileMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    // In a real app, you would update the theme here
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast.success(`${newTheme === 'dark' ? '다크' : '라이트'} 모드로 변경되었습니다.`);
  };

  const handleLanguageChange = (newLanguage: 'ko' | 'en') => {
    setLanguage(newLanguage);
    // In a real app, you would update i18n here
    toast.success(`${newLanguage === 'ko' ? '한국어' : 'English'}로 변경되었습니다.`);
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const parts = user.email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="User avatar" />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>프로필</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>설정</span>
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {theme === 'dark' ? (
                <Moon className="mr-2 h-4 w-4" />
              ) : (
                <Sun className="mr-2 h-4 w-4" />
              )}
              <span>테마</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as 'light' | 'dark')}>
                <DropdownMenuRadioItem value="light">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>라이트</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>다크</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Globe className="mr-2 h-4 w-4" />
              <span>언어</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={language} onValueChange={(value) => handleLanguageChange(value as 'ko' | 'en')}>
                <DropdownMenuRadioItem value="ko">
                  <span className="mr-2">🇰🇷</span>
                  <span>한국어</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="en">
                  <span className="mr-2">🇺🇸</span>
                  <span>English</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowShortcuts(true)}>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>단축키</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/help')}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>도움말</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-background border rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">키보드 단축키</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">대시보드</span>
                <kbd className="px-2 py-1 text-xs rounded bg-muted">Cmd/Ctrl + D</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">재고 관리</span>
                <kbd className="px-2 py-1 text-xs rounded bg-muted">Cmd/Ctrl + I</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">주문 관리</span>
                <kbd className="px-2 py-1 text-xs rounded bg-muted">Cmd/Ctrl + O</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">검색</span>
                <kbd className="px-2 py-1 text-xs rounded bg-muted">Cmd/Ctrl + K</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">알림</span>
                <kbd className="px-2 py-1 text-xs rounded bg-muted">Cmd/Ctrl + N</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">설정</span>
                <kbd className="px-2 py-1 text-xs rounded bg-muted">Cmd/Ctrl + ,</kbd>
              </div>
            </div>
            <Button 
              className="w-full mt-6" 
              onClick={() => setShowShortcuts(false)}
            >
              닫기
            </Button>
          </div>
        </div>
      )}
    </>
  );
}