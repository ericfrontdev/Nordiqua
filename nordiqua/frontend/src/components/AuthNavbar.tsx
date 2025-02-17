import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Bell } from 'lucide-react';
import { Button } from './ui/button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthNavbar() {
  const { user, signOut } = useAuthStore();

  if (!user) return null;

  return (
    <div className="fixed top-0 right-0 h-25 z-50 flex items-center gap-4 px-8">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-xl h-9 w-9"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center">
          3
        </span>
      </Button>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" size="sm" className="gap-3 rounded-xl h-9 px-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden md:inline font-medium">
              {user.name}
            </span>
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[200px] bg-white rounded-lg p-2 shadow-lg"
            sideOffset={5}
            align="end"
          >
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              {user.email}
            </div>
            <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
            <Link to="/settings">
              <DropdownMenu.Item className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
                <User className="h-4 w-4" />
                Mon profil
              </DropdownMenu.Item>
            </Link>
            <DropdownMenu.Item
              className="flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer mt-1"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}