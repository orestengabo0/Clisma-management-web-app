// src/components/Header.tsx
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BellIcon, SearchIcon, UserCog2, LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/authStore';

export function Header() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Replace these with your auth/user state
  const userName = 'Clisma Admin';
  const avatarUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT11ii7P372sU9BZPZgOR6ohoQbBJWbkJ0OVA&s'; // e.g. 'https://example.com/avatar.jpg'
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function goAccountCenter() {
    setMenuOpen(false);
    navigate('/account');
  }

  function logout() {
    setMenuOpen(false);
    clearAuth();
    navigate('/');
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-md text-gray-500 dark:text-gray-400">
          {formattedDate} | {formattedTime}
        </span>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <BellIcon className="" fill='#000' />
        </Button>

        {/* Profile: avatar + username with hover menu */}
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <div
              className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-800 cursor-pointer"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <Avatar className="h-8 w-8 ring-1 ring-gray-200 dark:ring-white/10">
                <AvatarImage src={avatarUrl} alt={`${userName} avatar`} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="text-md font-medium text-foreground">{userName}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-56 p-2"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="flex flex-col">
              <Button variant="ghost" className="justify-start" onClick={goAccountCenter}>
                <UserCog2 className="mr-2" /> Account Center
              </Button>
              <Button variant="ghost" className="justify-start text-destructive" onClick={logout}>
                <LogOut className="mr-2" /> Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}