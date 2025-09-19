// src/components/Header.tsx
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BellIcon, SearchIcon } from 'lucide-react';

export function Header() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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

        {/* Profile: avatar + username */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-800">
          <Avatar className="h-8 w-8 ring-1 ring-gray-200 dark:ring-white/10">
            <AvatarImage src={avatarUrl} alt={`${userName} avatar`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-md font-medium text-foreground">{userName}</span>
        </div>
      </div>
    </header>
  );
}