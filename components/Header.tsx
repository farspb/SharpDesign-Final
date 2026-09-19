import React, { useState } from 'react';
import { Menu, X, Moon, Sun, Hash, Languages, User, LogIn, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.crypto, href: '/crypto' },
    { label: t.nav.stock, href: '/stock' },
    { label: t.nav.astrology, href: '/astrology' },
    { label: t.nav.news, href: '/news' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-[#0B1120]/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo #kala */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-1 group cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
                <Hash className="w-6 h-6" />
                <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white ml-2">
              {language === 'fa' ? 'کالا' : 'kala'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse bg-gray-100/50 dark:bg-white/5 px-6 py-2 rounded-full border border-gray-200/50 dark:border-white/5 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-semibold transition-all duration-200 ${
                  isActive(item.href) 
                    ? 'text-primary-600 dark:text-primary-400 scale-105' 
                    : 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="hidden md:flex items-center gap-3">
             {/* Auth Button */}
             {user ? (
                 <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-bold text-xs uppercase tracking-wider border border-primary-100 dark:border-primary-800">
                        <User className="w-3.5 h-3.5" />
                        <span>{user.name}</span>
                    </div>
                    <button onClick={logout} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title={t.nav.logout}>
                        <LogOut className="w-5 h-5" />
                    </button>
                 </div>
             ) : (
                <Link to="/auth" className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold transition-all hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5">
                    <LogIn className="w-4 h-4" />
                    <span>{t.nav.login}</span>
                </Link>
             )}

            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2"></div>

            {/* Lang Switch */}
            <button
              onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold transition-colors text-gray-600 dark:text-gray-300 uppercase"
            >
              <Languages className="w-4 h-4" />
              <span>{language === 'fa' ? 'EN' : 'FA'}</span>
            </button>

            {/* Theme Switch */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-[#0B1120] border-b border-gray-200 dark:border-gray-800 shadow-xl z-50">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`block px-3 py-3 rounded-lg text-base font-medium ${
                    isActive(item.href)
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
               {user ? (
                   <div className="flex items-center justify-between px-3">
                       <span className="text-primary-600 font-bold">{user.name}</span>
                       <button onClick={logout} className="text-red-500 text-sm font-medium">{t.nav.logout}</button>
                   </div>
               ) : (
                   <Link 
                    to="/auth"
                    className="block text-center px-4 py-3 rounded-lg bg-primary-600 text-white font-bold"
                    onClick={() => setIsMenuOpen(false)}
                   >
                       {t.nav.login}
                   </Link>
               )}
               
               <div className="flex justify-between px-3 mt-2">
                   <button
                    onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                    <Languages className="w-5 h-5" />
                    <span>{language === 'fa' ? 'English' : 'فارسی'}</span>
                </button>
                
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-md bg-gray-100 dark:bg-gray-800"
                >
                    {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                    <Moon className="w-5 h-5 text-slate-700" />
                    )}
                </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;