'use client';

import Link from 'next/link';
import { Brain, Zap, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/Button';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
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
                <Button className="text-lg px-8 py-4 shadow-xl shadow-[#2c7a7b]/20 hover:shadow-2xl hover:shadow-[#2c7a7b]/30 transition-all hover:-translate-y-1">
                  {t('btn_start')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/knowledge">
                <button className="px-8 py-4 rounded-lg font-semibold text-gray-600 hover:text-[#2c7a7b] hover:bg-gray-50 transition-colors border border-gray-200 hover:border-[#2c7a7b]">
                  了解更多知识
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#e6fffa] rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#e6fffa] rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
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
