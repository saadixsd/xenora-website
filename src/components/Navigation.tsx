import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import XenoraLogo from "./XenoraLogo";
import DarkModeToggle from "./DarkModeToggle";
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const userToken = localStorage.getItem('userToken');
      // Only consider user logged in if they have a valid token
      // Don't rely on route or userName alone
      setIsLoggedIn(!!userToken);
    };
    
    checkAuthStatus();
    // Listen for storage changes (login/logout events)
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('navigation.home'), path: "/" },
    { name: t('navigation.models'), path: "/models" },
    { name: t('navigation.pricing'), path: "/pricing" },
    { name: t('navigation.about'), path: "/about" },
    { name: t('navigation.contact'), path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 glass-nav",
      isScrolled && "scrolled"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover-scale group">
            <XenoraLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-primary relative",
                  "hover:after:scale-x-100 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300",
                  isActive(item.path) 
                    ? "text-primary after:scale-x-100" 
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle />
            {isLoggedIn ? (
              <Button variant="ghost" asChild className="hover-scale">
                <Link to="/dashboard">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover-scale">
                  <Link to="/login">{t('navigation.login')}</Link>
                </Button>
                <Button asChild className="bg-primary-gradient hover:shadow-glow hover-scale transition-all duration-300">
                  <Link to="/login">{t('navigation.scheduleDemo')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-strong border-t border-white/10 rounded-b-2xl">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "block px-3 py-2 text-base font-medium transition-colors rounded-md",
                    isActive(item.path)
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-primary hover:bg-accent"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
               ))}
               
                {/* Mobile Controls */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t border-border mt-4">
                  <DarkModeToggle />
                </div>
               
                <div className="pt-4 space-y-2">
                  {isLoggedIn ? (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          {t('navigation.login')}
                        </Link>
                      </Button>
                      <Button className="w-full justify-start bg-primary-gradient" asChild>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          {t('navigation.scheduleDemo')}
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;