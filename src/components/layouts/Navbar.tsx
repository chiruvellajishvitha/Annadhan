import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Heart, Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (profile?.role === 'admin') return '/admin';
    if (profile?.role === 'donor') return '/donor';
    if (profile?.role === 'ngo' || profile?.role === 'volunteer') return '/ngo';
    return '/';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-secondary">
            <Heart className="h-6 w-6 fill-secondary" />
            <span className="hidden md:inline">Annadhan</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-secondary transition-colors">Home</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="text-sm font-medium hover:text-secondary transition-colors">Dashboard</Link>
              {profile?.role === 'donor' && (
                <Link to="/donor/post" className="text-sm font-medium hover:text-secondary transition-colors">Donate Food</Link>
              )}
              <Link to="/notifications" className="relative p-2 hover:bg-muted rounded-full transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={profile?.name as string} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {(profile?.name as string || 'U').charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.name as string}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email as string}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-secondary hover:bg-secondary/90 text-white">Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-4">
          {user && (
            <Link to="/notifications" className="relative p-2">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-10">
                <Link to="/" className="text-lg font-semibold">Home</Link>
                {user ? (
                  <>
                    <Link to={getDashboardLink()} className="text-lg font-semibold">Dashboard</Link>
                    {profile?.role === 'donor' && (
                      <Link to="/donor/post" className="text-lg font-semibold">Donate Food</Link>
                    )}
                    <Link to="/profile" className="text-lg font-semibold">Profile</Link>
                    <Button variant="destructive" onClick={handleSignOut} className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login">
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
