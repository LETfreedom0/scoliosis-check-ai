'use client';

import Link from 'next/link';
import { Brain, Zap, ShieldCheck, ArrowRight, Activity, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/Button';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 isolate">
        {/* Decorative background elements - Professional Medical/Tech Style */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* 1. Base Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-white" />
          
          {/* 2. Grid Pattern - Subtle Tech feel */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.5]" aria-hidden="true">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M.5 40V.5H40" fill="none" stroke="currentColor" className="text-gray-200" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            {/* Fade out grid at bottom */}
            <mask id="fade-bottom">
              <linearGradient id="gradient-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" />
                <stop offset="80%" stopColor="white" />
                <stop offset="100%" stopColor="black" />
              </linearGradient>
            </mask>
          </svg>

          {/* 3. Abstract Spine/Medical Curves - Right Side */}
          <div className="absolute right-0 top-0 h-full w-full md:w-2/3 opacity-10 transform translate-x-1/4">
             <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="h-full w-full">
                {/* Central Curve */}
                <path d="M100 0 C120 40, 80 80, 100 120 C120 160, 80 200, 100 240" stroke="#2c7a7b" strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
                {/* Echo Curves */}
                <path d="M60 0 C80 40, 40 80, 60 120 C80 160, 40 200, 60 240" stroke="#2c7a7b" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.4" />
                <path d="M140 0 C160 40, 120 80, 140 120 C160 160, 120 200, 140 240" stroke="#2c7a7b" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.4" />
             </svg>
          </div>

          {/* 4. Ambient Blurs - Softness */}
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#e6fffa] rounded-full blur-[80px] opacity-70 mix-blend-multiply" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[80px] opacity-70 mix-blend-multiply" />
          
          {/* 5. Floating Plus Signs - Medical Context */}
          <div className="absolute top-24 left-[10%] text-gray-200 animate-pulse" style={{ animationDuration: '4s' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          <div className="absolute bottom-32 right-[15%] text-gray-200 animate-pulse" style={{ animationDuration: '5s' }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          <div className="absolute top-1/3 right-[5%] text-gray-100">
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e6fffa] text-[#2c7a7b] rounded-full text-sm font-semibold mb-8 animate-fade-in-up">
              <Activity className="w-4 h-4" />
              <span>AI 驱动的脊柱健康筛查</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              {t('hero_title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('hero_desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/detect">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#2c7a7b] to-[#319795] hover:from-[#319795] hover:to-[#38b2ac] border-0 shadow-xl shadow-[#2c7a7b]/30 hover:shadow-2xl hover:shadow-[#2c7a7b]/40 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    {t('btn_start')}
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Link href="/chat">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:text-[#2c7a7b] hover:border-[#2c7a7b] shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group"
                >
                  <span className="flex items-center">
                    <MessageCircle className="mr-2 w-5 h-5 text-[#2c7a7b] opacity-70 group-hover:opacity-100 transition-opacity" />
                    {t('btn_advice')}
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden isolate">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#f7fafc" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们？</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">我们利用先进的人工智能技术，为您提供快速、准确且保护隐私的脊柱健康评估服务。</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-[#2c7a7b]">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('feature_ai_title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('feature_ai_desc')}</p>
            </div>
            
            <div className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-[#2c7a7b]">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('feature_fast_title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('feature_fast_desc')}</p>
            </div>
            
            <div className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-[#2c7a7b]">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('feature_privacy_title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('feature_privacy_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
