'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#2d3748] text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm opacity-90" dangerouslySetInnerHTML={{ __html: t('footer_text') }} />
      </div>
    </footer>
  );
}
