"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomButton } from "@/components/CustomButton";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkAdminRole = async (user: User | null) => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(profile?.role === 'admin');
      }
    };

    const handleAuthChange = async (session: any) => {
      setLoading(true);
      const currentUser = session?.user || null;
      setUser(currentUser);
      await checkAdminRole(currentUser);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleAuthChange(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Hiba a kijelentkezés során:", error.message);
      alert("Hiba a kijelentkezés során: " + error.message);
    }
    setLoading(false);
  };

  const renderAuthButtons = () => {
    if (loading) {
      return <div className="text-gray-800">Betöltés...</div>;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CustomButton variant="ghost" className="relative h-8 w-8 rounded-full text-gray-800 hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || "Felhasználó"} />
                <AvatarFallback>
                  <UserIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </CustomButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "Felhasználó"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profil')} className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profilom</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Kijelentkezés</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <CustomButton asChild className="px-6 py-2 rounded-lg">
          <Link to="/auth">
            <LogIn className="mr-2 h-4 w-4" />
            Bejelentkezés
          </Link>
        </CustomButton>
      );
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 py-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-6 md:px-12">
        <Link to="/" className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
          <img src="/logo.jpg" alt="PCAS Logo" className="h-10 w-10 object-contain" />
          <span>PCAS</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isMobile ? (
            <CustomButton variant="ghost" size="icon" onClick={toggleMenu} className="text-gray-800 hover:bg-gray-100">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </CustomButton>
          ) : (
            <>
              <Link to="/" className="text-gray-600 hover:text-primary">
                Főoldal
              </Link>
              <Link to="/auction" className="text-gray-600 hover:text-primary">
                Aukciók
              </Link>
              <Link to="/orokbefogadas" className="text-gray-600 hover:text-primary">
                Örökbefogadás
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-primary">
                Rólunk
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary">
                Kapcsolat
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-600 hover:text-primary">
                  Adminisztráció
                </Link>
              )}
              {renderAuthButtons()}
            </>
          )}
        </div>
      </div>

      {isMobile && isOpen && (
        <div className="container mx-auto px-6 md:px-12 mt-4 flex flex-col space-y-2 text-gray-800">
          <Link to="/" className="block hover:text-primary py-2" onClick={toggleMenu}>
            Főoldal
          </Link>
          <Link to="/auction" className="block hover:text-primary py-2" onClick={toggleMenu}>
            Aukciók
          </Link>
          <Link to="/orokbefogadas" className="block hover:text-primary py-2" onClick={toggleMenu}>
            Örökbefogadás
          </Link>
          <Link to="/about" className="block hover:text-primary py-2" onClick={toggleMenu}>
            Rólunk
          </Link>
          <Link to="/contact" className="block hover:text-primary py-2" onClick={toggleMenu}>
            Kapcsolat
          </Link>
          {isAdmin && (
            <Link to="/admin" className="block hover:text-primary py-2" onClick={toggleMenu}>
              Adminisztráció
            </Link>
          )}
          <div className="pt-2">
            {renderAuthButtons()}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;