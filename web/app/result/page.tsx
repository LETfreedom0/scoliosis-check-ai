'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, AlertTriangle, CheckCircle, RefreshCw, FileText } from 'lucide-react';
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
        <div className="p-8 text-center border-b border-gray-100">
          <div className="flex justify-center mb-6">
            {statusInfo.icon}
          </div>
          
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 ${statusInfo.color}`}>
            {statusInfo.status}
          </span>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {statusInfo.title}
          </h1>
          
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            {statusInfo.desc}
            {result.reason && (
              <span className="block mt-4 text-sm bg-gray-50 p-3 rounded text-gray-700 italic">
                AI 分析详情: {result.reason}
              </span>
            )}
          </p>
        </div>

        <div className="p-8 bg-gray-50">
          <h3 className="font-bold text-lg text-[#2c7a7b] mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('analysis_report')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-4 rounded border border-gray-200">
              <span className="text-gray-500 block mb-1">{t('analysis_item')}</span>
              <span className="font-medium text-gray-900">
                {result.analysisType === 'xray' ? t('mode_xray') : t('analysis_item_val')}
              </span>
            </div>
            
            <div className="bg-white p-4 rounded border border-gray-200">
              <span className="text-gray-500 block mb-1">{t('analysis_model')}</span>
              <span className="font-medium text-gray-900">GPT-4o Vision</span>
            </div>

            {result.angle !== undefined && result.type !== 'invalid' && (
              <div className="bg-white p-4 rounded border border-gray-200 md:col-span-2">
                <span className="text-gray-500 block mb-1">{t('analysis_key_metric')}</span>
                <span className="font-medium text-gray-900">Cobb Angle ≈ {result.angle}°</span>
              </div>
            )}

            {result.abnormalIndicators && result.abnormalIndicators.length > 0 && (
              <div className="bg-white p-4 rounded border border-gray-200 md:col-span-2">
                <span className="text-gray-500 block mb-2">{t('abnormal_indicators')}</span>
                <div className="flex flex-wrap gap-2">
                  {result.abnormalIndicators.map((indicator, index) => (
                    <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-100">
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
          <Button onClick={() => router.push('/knowledge')} className="flex items-center justify-center gap-2">
            <Activity className="h-4 w-4" />
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
