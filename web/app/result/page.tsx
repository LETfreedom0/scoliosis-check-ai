'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, AlertTriangle, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/Button';
import { AnalysisResult } from '@/lib/api';

export default function ResultPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const resultData = localStorage.getItem('scoliosis_result');
    if (resultData) {
      setResult(JSON.parse(resultData));
    } else {
      router.push('/detect');
    }
  }, [router]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c7a7b] mb-4"></div>
        <p className="text-gray-600">{t('result_loading_title')}</p>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (result.type) {
      case 'normal':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          color: 'bg-green-100 text-green-800',
          title: t('result_title_normal'),
          desc: t('result_desc_normal'),
          status: t('result_status_normal')
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
          color: 'bg-yellow-100 text-yellow-800',
          title: t('result_title_warning'),
          desc: `${t('result_desc_warning_prefix')}${result.angle}${t('result_desc_warning_suffix')}`,
          status: t('result_status_warning')
        };
      case 'danger':
        return {
          icon: <Activity className="h-16 w-16 text-red-500" />,
          color: 'bg-red-100 text-red-800',
          title: t('result_title_danger'),
          desc: `${t('result_desc_danger_prefix')}${result.angle}${t('result_desc_danger_suffix')}`,
          status: t('result_status_danger')
        };
      case 'invalid':
        return {
          icon: <AlertTriangle className="h-16 w-16 text-gray-500" />,
          color: 'bg-gray-100 text-gray-800',
          title: t('result_title_invalid'),
          desc: t('result_desc_invalid'),
          status: t('result_status_invalid')
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-6">
              {statusInfo.icon}
            </div>
            
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {statusInfo.title}
            </h1>
          </div>
          
          <div className="space-y-4 max-w-xl mx-auto">
            {/* Conclusion Card */}
            <div className={`p-5 rounded-lg border ${
              result.type === 'normal' ? 'bg-green-50 border-green-100' : 
              result.type === 'warning' ? 'bg-yellow-50 border-yellow-100' : 
              result.type === 'danger' ? 'bg-red-50 border-red-100' : 
              'bg-gray-50 border-gray-100'
            }`}>
              <h3 className={`font-bold mb-2 ${
                result.type === 'normal' ? 'text-green-800' : 
                result.type === 'warning' ? 'text-yellow-800' : 
                result.type === 'danger' ? 'text-red-800' : 
                'text-gray-800'
              }`}>
                {t('result_conclusion')}
              </h3>
              <p className={`${
                result.type === 'normal' ? 'text-green-900' : 
                result.type === 'warning' ? 'text-yellow-900' : 
                result.type === 'danger' ? 'text-red-900' : 
                'text-gray-900'
              } leading-relaxed`}>
                {statusInfo.desc}
              </p>
            </div>

            {/* AI Reason Card */}
            {result.reason && (
              <div className="p-5 rounded-lg bg-blue-50 border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">
                  {t('result_ai_details')}
                </h3>
                <p className="text-blue-900 text-sm leading-relaxed">
                  {result.reason}
                </p>
              </div>
            )}
            
            {/* Abnormal Indicators Card */}
            {result.abnormalIndicators && result.abnormalIndicators.length > 0 && (
              <div className="p-5 rounded-lg bg-rose-50 border border-rose-100">
                <h3 className="font-bold text-rose-800 mb-3">{t('abnormal_indicators')}</h3>
                <div className="flex flex-wrap gap-2">
                  {result.abnormalIndicators.map((indicator, index) => (
                    <span key={index} className="px-3 py-1 bg-white text-rose-700 text-sm rounded-full border border-rose-200 shadow-sm">
                      {indicator}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 flex flex-col md:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/detect')} variant="outline" className="flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4" />
            {t('btn_retest')}
          </Button>
          <Button onClick={() => router.push('/chat')} className="flex items-center justify-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('btn_advice')}
          </Button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500 max-w-2xl mx-auto">
        <p className="font-bold mb-1">{t('disclaimer_title')}</p>
        <p>{t('disclaimer_text')}</p>
      </div>
    </div>
  );
}
