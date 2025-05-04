
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Menu, X } from "lucide-react";

const Header = () => {
  const { user, isTeacher, isStudent } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was an issue signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDashboardLink = () => {
    if (isTeacher) return '/teacher-dashboard';
    if (isStudent) return '/student-dashboard';
    return '/';
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Trivius
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to={getDashboardLink()} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">
                  Dashboard
                </Link>
                <div className="text-gray-600 dark:text-gray-300">
                  Welcome, {user.name}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut} 
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">
                  Login
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 py-3 border-t">
            <nav className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="text-gray-600 dark:text-gray-300">
                    Welcome, {user.name}
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut} 
                    className="flex items-center justify-start gap-2"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
