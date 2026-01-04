'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

// 定义用户接口，保持与现有代码的一致性，但映射到Supabase用户
export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => Promise<{ error: AuthError | null | string }>;
  logout: () => Promise<void>;
  register: (user: User) => Promise<{ error: AuthError | null | string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查当前会话
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
        });
      }
      setLoading(false);
    };

    checkSession();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (userData: User) => {
    if (!userData.email || !userData.password) {
      return { error: 'Email and password are required' };
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const register = async (newUser: User) => {
    if (!newUser.email || !newUser.password) {
      return { error: 'Email and password are required' };
    }

    const { error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: {
        data: {
          name: newUser.name,
        },
      },
    });

    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
