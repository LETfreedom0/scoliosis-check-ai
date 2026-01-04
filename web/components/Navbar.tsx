'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, User, LogOut, Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path ? 'text-[#2c7a7b]' : 'text-gray-600 hover:text-[#2c7a7b]';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[#2c7a7b]">
              <HeartPulse className="h-8 w-8" />
              <span>SpineCheck AI</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`font-medium transition-colors ${isActive('/')}`}>
              {t('nav_home')}
            </Link>
            <Link href="/detect" className={`font-medium transition-colors ${isActive('/detect')}`}>
              {t('nav_detect')}
            </Link>
            <Link href="/history" className={`font-medium transition-colors ${isActive('/history')}`}>
              {t('nav_history')}
            </Link>
            <Link href="/chat" className={`font-medium transition-colors ${isActive('/chat')}`}>
              {t('nav_chat')}
            </Link>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-[#2c7a7b] font-medium">
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block border border-gray-100">
                    <button 
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('nav_logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-[#2c7a7b] font-medium">
                  {t('nav_login')}
                </Link>
              )}

              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 border-l pl-4 border-gray-200">
                <button 
                  onClick={() => setLanguage('zh-CN')}
                  className={`hover:text-[#2c7a7b] ${language === 'zh-CN' ? 'text-[#2c7a7b] font-bold' : ''}`}
                >
                  CN
                </button>
                <span>/</span>
                <button 
                  onClick={() => setLanguage('en-US')}
                  className={`hover:text-[#2c7a7b] ${language === 'en-US' ? 'text-[#2c7a7b] font-bold' : ''}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-[#2c7a7b]"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link href="/" className={`font-medium ${isActive('/')}`} onClick={() => setIsMenuOpen(false)}>
                {t('nav_home')}
              </Link>
              <Link href="/detect" className={`font-medium ${isActive('/detect')}`} onClick={() => setIsMenuOpen(false)}>
                {t('nav_detect')}
              </Link>
              <Link href="/history" className={`font-medium ${isActive('/history')}`} onClick={() => setIsMenuOpen(false)}>
                {t('nav_history')}
              </Link>
              <Link href="/chat" className={`font-medium ${isActive('/chat')}`} onClick={() => setIsMenuOpen(false)}>
                {t('nav_chat')}
              </Link>
              
              {user ? (
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </div>
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="flex items-center text-gray-600 hover:text-[#2c7a7b]"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav_logout')}
                  </button>
                </div>
              ) : (
                <Link href="/login" className="font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>
                  {t('nav_login')}
                </Link>
              )}

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setLanguage('zh-CN')}
                  className={`px-3 py-1 rounded ${language === 'zh-CN' ? 'bg-[#2c7a7b] text-white' : 'bg-gray-100'}`}
                >
                  中文
                </button>
                <button 
                  onClick={() => setLanguage('en-US')}
                  className={`px-3 py-1 rounded ${language === 'en-US' ? 'bg-[#2c7a7b] text-white' : 'bg-gray-100'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
