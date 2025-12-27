'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/Button';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      alert(t('error_fill_all'));
      return;
    }

    if (isLogin) {
      // Login Logic
      // In a real app, you would verify against a backend.
      // Here we simulate checking against local storage (which AuthContext handles roughly)
      // BUT AuthContext's login just sets the user. We need to verify credentials first.
      
      const USERS_KEY = 'scoliosis_users';
      const usersJson = localStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      const user = users.find((u: any) => u.email === formData.email);

      if (user && user.password === formData.password) {
        login(user);
        alert(t('login_success'));
        router.push('/');
      } else {
        alert(t('error_user_not_found'));
      }
    } else {
      // Register Logic
      const success = register(formData);
      if (success) {
        alert(t('register_success'));
        setIsLogin(true);
      } else {
        alert(t('error_user_exists'));
      }
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#2c7a7b]">
            {isLogin ? t('login_title') : t('register_title')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t('name_label')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2c7a7b] focus:border-[#2c7a7b] focus:z-10 sm:text-sm"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('email_label')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2c7a7b] focus:border-[#2c7a7b] focus:z-10 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('password_label')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2c7a7b] focus:border-[#2c7a7b] focus:z-10 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              {isLogin ? t('btn_login') : t('btn_register')}
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-[#2c7a7b] hover:text-[#319795]"
          >
            {isLogin ? t('switch_to_register') : t('switch_to_login')}
          </button>
        </div>
      </div>
    </div>
  );
}
