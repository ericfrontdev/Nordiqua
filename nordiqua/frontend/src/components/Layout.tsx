import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings as SettingsIcon,
  Menu,
  X,
  Package,
  Bell,
  User,
} from 'lucide-react';
import { Button } from './ui/button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Factures', href: '/invoices', icon: FileText },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Produits', href: '/products', icon: Package },
  { name: 'Paramètres', href: '/settings', icon: SettingsIcon },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuthStore();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Mobile Navbar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100/20 z-50 md:hidden">
        <div className="flex items-center justify-between h-full px-4">
          <Link to="/dashboard" className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nordiqua
            </span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl h-9 w-9"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex min-h-screen pt-16 md:pt-0">
        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="h-full p-4">
            <div className="glass-effect h-full rounded-2xl">
              <div className="flex flex-col h-full">
                <div className="p-6 hidden md:block">
                  <Link to="/dashboard" className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <FileText className="h-7 w-7 text-primary" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Nordiqua
                    </span>
                  </Link>
                </div>
                <nav className="flex-1 px-4 pt-4">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`${
                          isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'text-secondary hover:bg-secondary/10'
                        } flex items-center gap-3 rounded-xl px-4 py-3 mb-2 transition-all duration-200`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="p-4">
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">
                      Version Pro disponible
                    </p>
                    <button className="mt-2 w-full bg-secondary text-white px-4 py-2 text-sm font-medium hover:bg-secondary/90 transition-colors rounded-xl">
                      Mettre à niveau
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 p-4 md:p-6 w-full">
          <div className="glass-effect rounded-2xl min-h-full">
            {/* Header avec notifications et profil */}
            <div className="p-4 md:p-6 border-b border-gray-100/20">
              <div className="flex items-center justify-end gap-4">
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
                        <X className="h-4 w-4" />
                        Déconnexion
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="p-4 md:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}