    'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getHistory } from '@/lib/history';
import { HistoryRecord } from '@/lib/models/types';
import { Calendar, ChevronRight, Activity, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function HistoryPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load history
    const records = getHistory(user?.email);
    setHistory(records);
    setLoading(false);
  }, [user]);

  const handleViewDetail = (record: HistoryRecord) => {
    localStorage.setItem('scoliosis_result', JSON.stringify(record.result));
    // Also store the image preview if needed by result page, 
    // but result page currently doesn't seem to use a global preview state other than what's passed or stored.
    // The current result page implementation relies on localStorage 'scoliosis_result'.
    // If the result page needs the image to display, we might need to adjust.
    // Let's check result page implementation later. For now, we assume it just shows the data.
    router.push('/result');
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'danger': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'normal': return <CheckCircle2 className="w-5 h-5" />;
      case 'warning': return <Activity className="w-5 h-5" />;
      case 'danger': return <AlertTriangle className="w-5 h-5" />;
      default: return <XCircle className="w-5 h-5" />;
    }
  };

  const getStatusText = (type: string) => {
    switch (type) {
      case 'normal': return t('result_status_normal');
      case 'warning': return t('result_status_warning');
      case 'danger': return t('result_status_danger');
      default: return t('result_status_invalid');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('history_title')}</h1>
        <p className="text-gray-500">
            {user ? `${user.name} (${user.email})` : 'Anonymous User'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2c7a7b]"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">{t('history_empty')}</p>
          <button 
            onClick={() => router.push('/detect')}
            className="mt-6 text-[#2c7a7b] font-medium hover:underline"
          >
            {t('btn_start')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div 
              key={record.id}
              onClick={() => handleViewDetail(record)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2c7a7b]/30 transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 items-center"
            >
              <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                 {/* Using object-cover for thumbnails */}
                <img 
                  src={record.imageData || '/file.svg'} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(record.date).toLocaleString()}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full text-gray-500 bg-gray-100 border border-gray-200 uppercase">
                     {record.result.analysisType === 'xray' ? 'X-ray' : 'Photo'}
                  </span>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start gap-3">
                   <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(record.result.type)}`}>
                      {getStatusIcon(record.result.type)}
                      <span className="font-medium text-sm">
                        {getStatusText(record.result.type)}
                      </span>
                   </div>
                   {record.result.angle !== undefined && (
                     <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        {record.result.angle}°
                     </span>
                   )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#e6fffa] group-hover:text-[#2c7a7b] transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
