'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Apple, Activity, BarChart3 } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppLogo } from './AppLogo';
import { Button } from './ui/button'; // Using button for theme toggle example
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/exercise', label: 'Exercise', icon: Activity },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  if (!mounted) {
    return null; // Avoid rendering until theme is determined to prevent flash
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <AppLogo />
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right', align: 'center' }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-sidebar-foreground hover:bg-sidebar-accent">
            {theme === 'light' ? <Moon /> : <Sun />}
            <span className="sr-only">Toggle theme</span>
          </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
