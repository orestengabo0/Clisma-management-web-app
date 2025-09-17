// src/components/Header.tsx
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BellIcon, SearchIcon } from 'lucide-react';

export function Header() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    // Cleanup the timer on component unmount
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

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formattedDate} | {formattedTime}
        </span>
        <Button variant="ghost" size="icon">
          <BellIcon className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}