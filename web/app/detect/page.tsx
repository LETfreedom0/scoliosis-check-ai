'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Camera, AlertCircle, Info, CheckCircle2, Scan } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/Button';
import { analyzeImageWithAI } from '@/lib/api';
import { addHistory } from '@/lib/history';
import { useAuth } from '@/contexts/AuthContext';

const GuideIllustrations = {
  Standing: () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="150" rx="12" fill="#e6fffa" />
      
      <g className="animate-breathe">
        {/* Head */}
        <circle cx="100" cy="35" r="15" fill="#2c7a7b"/>
        
        {/* Body Torso */}
        <path d="M80 55H120L115 100H85L80 55Z" fill="#2c7a7b" fillOpacity="0.8"/>
        
        {/* Legs (Together) */}
        <path d="M90 100V140" stroke="#2c7a7b" strokeWidth="12" strokeLinecap="round"/>
        <path d="M110 100V140" stroke="#2c7a7b" strokeWidth="12" strokeLinecap="round"/>
        
        {/* Arms (Hanging Naturally) - swaying slightly */}
        <path d="M75 58C70 70 70 90 75 105" stroke="#2c7a7b" strokeWidth="6" strokeLinecap="round" className="animate-sway-left"/>
        <path d="M125 58C130 70 130 90 125 105" stroke="#2c7a7b" strokeWidth="6" strokeLinecap="round" className="animate-sway-right"/>
      </g>
      
      {/* Spine Line (Dotted) - appearing */}
      <path d="M100 55V95" stroke="white" strokeWidth="2" strokeDasharray="3 3" className="animate-appear"/>
      
      {/* Checkmarks - popping */}
      <g className="animate-pop-in">
        <circle cx="150" cy="70" r="10" fill="#38b2ac" fillOpacity="0.2"/>
        <path d="M145 70L148 73L155 66" stroke="#2c7a7b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>

      <style>{`
        .animate-breathe { animation: breathe 4s infinite ease-in-out; transform-origin: center bottom; }
        .animate-sway-left { animation: sway-left 3s infinite ease-in-out; transform-origin: 75px 58px; }
        .animate-sway-right { animation: sway-right 3s infinite ease-in-out; transform-origin: 125px 58px; }
        .animate-appear { animation: appear 2s infinite; }
        .animate-pop-in { animation: pop-in 2s infinite cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-origin: 150px 70px; }
        
        @keyframes breathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.02); } }
        @keyframes sway-left { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(2deg); } }
        @keyframes sway-right { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-2deg); } }
        @keyframes appear { 0%, 50% { opacity: 0; stroke-dashoffset: 10; } 100% { opacity: 1; stroke-dashoffset: 0; } }
        @keyframes pop-in { 0%, 20% { transform: scale(0); opacity: 0; } 40%, 80% { transform: scale(1); opacity: 1; } 100% { transform: scale(0); opacity: 0; } }
      `}</style>
    </svg>
  ),
  Bending: () => (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="150" rx="12" fill="#e6fffa" />
      
      {/* Legs (Straight) */}
      <path d="M130 70V130" stroke="#2c7a7b" strokeWidth="10" strokeLinecap="round"/>
      
      {/* Torso Group - Bending Animation */}
      <g className="animate-bend">
        {/* Torso */}
        <path d="M135 70C110 70 80 70 60 75" stroke="#2c7a7b" strokeWidth="14" strokeLinecap="round"/>
        {/* Head */}
        <circle cx="50" cy="80" r="12" fill="#2c7a7b"/>
        {/* Arms */}
        <path d="M70 75L70 120" stroke="#2c7a7b" strokeWidth="6" strokeLinecap="round"/>
        {/* Spine Arch Highlight */}
        <path d="M120 65C100 65 80 65 70 68" stroke="#38b2ac" strokeWidth="2" strokeDasharray="3 3" opacity="0.8"/>
      </g>
      
      {/* 90 Degree Angle Indicator - Fading in */}
      <path d="M110 90V75H95" stroke="#2c7a7b" strokeWidth="1" strokeDasharray="2 2" className="animate-fade-cycle"/>

      <style>{`
        .animate-bend { animation: bend 3s infinite ease-in-out; transform-origin: 130px 70px; }
        .animate-fade-cycle { animation: fade-cycle 3s infinite; }
        
        @keyframes bend { 
          0%, 100% { transform: rotate(0deg); } 
          50% { transform: rotate(5deg); } 
        }
        @keyframes fade-cycle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>
    </svg>
  )
};

export default function DetectPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [analysisType, setAnalysisType] = useState<'photo' | 'xray'>('photo');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Reset input value to allow selecting the same file again
    if (e.target.value) {
      e.target.value = '';
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件');
      return;
    }
    setFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyzeClick = () => {
    if (!preview) return;
    setShowConfirm(true);
  };

  const analyze = async () => {
    if (!preview) return;
    setShowConfirm(false);
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeImageWithAI(preview, undefined, analysisType);
      localStorage.setItem('scoliosis_result', JSON.stringify(result));
      
      // Save to history
      addHistory(result, preview, user?.email);
      
      router.push('/result');
    } catch (error: any) {
      console.error(error);
      if (error.message && (error.message.includes('Failed to parse AI response') || error.message.includes('Invalid response structure'))) {
        setError(t('api_error'));
      } else {
        setError(t('api_error') + error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50/50 isolate">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* 1. Base Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-white" />
        
        {/* 2. Grid Pattern */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.5]" aria-hidden="true">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M.5 40V.5H40" fill="none" stroke="currentColor" className="text-gray-200" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          <mask id="fade-bottom">
            <linearGradient id="gradient-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" />
              <stop offset="80%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </linearGradient>
          </mask>
        </svg>

        {/* 3. Abstract Spine/Medical Curves */}
        <div className="absolute right-0 top-0 h-full w-full md:w-2/3 opacity-10 transform translate-x-1/4">
            <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="h-full w-full">
              <path d="M100 0 C120 40, 80 80, 100 120 C120 160, 80 200, 100 240" stroke="#2c7a7b" strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
              <path d="M60 0 C80 40, 40 80, 60 120 C80 160, 40 200, 60 240" stroke="#2c7a7b" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.4" />
              <path d="M140 0 C160 40, 120 80, 140 120 C160 160, 120 200, 140 240" stroke="#2c7a7b" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.4" />
            </svg>
        </div>

        {/* 4. Ambient Blurs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#e6fffa] rounded-full blur-[80px] opacity-70 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[80px] opacity-70 mix-blend-multiply" />
        
        {/* 5. Medical Symbols */}
        <div className="absolute top-24 left-[5%] text-gray-200 animate-pulse" style={{ animationDuration: '4s' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        </div>
        <div className="absolute bottom-32 right-[10%] text-gray-200 animate-pulse" style={{ animationDuration: '5s' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2c7a7b] opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#2c7a7b] mb-6 relative z-10 tracking-tight">{t('detect_title')}</h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto relative z-10 leading-relaxed">{t('detect_desc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Upload Section */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-8 h-full border border-gray-100 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <div className="bg-[#e6fffa] p-2 rounded-xl">
                <Upload className="w-6 h-6 text-[#2c7a7b]" />
              </div>
              {t('upload_title')}
            </h2>
            
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${analysisType === 'photo' ? 'bg-white text-[#2c7a7b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setAnalysisType('photo')}
              >
                {t('mode_photo')}
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${analysisType === 'xray' ? 'bg-white text-[#2c7a7b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setAnalysisType('xray')}
              >
                {t('mode_xray')}
              </button>
            </div>

            <div
              className={`relative border-3 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 flex-grow flex flex-col items-center justify-center group ${
                isDragging 
                  ? 'border-[#2c7a7b] bg-[#e6fffa] scale-[1.01] border-dashed shadow-inner' 
                  : preview 
                    ? 'border-[#2c7a7b] bg-gray-50 border-solid shadow-sm' 
                    : 'border-gray-200 hover:border-[#2c7a7b] hover:bg-gray-50 border-dashed hover:shadow-lg hover:shadow-gray-100'
              }`}
              style={{ minHeight: '500px' }}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {preview ? (
                <div className="relative w-full h-full flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-500">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-[450px] max-w-full w-auto rounded-xl shadow-lg object-contain bg-white" 
                  />
                  <div className={`absolute inset-0 transition-all rounded-xl flex items-center justify-center backdrop-blur-[2px] ${
                    isDragging ? 'bg-black/30' : 'opacity-0 hover:opacity-100 hover:bg-black/20'
                  }`}>
                    <p className={`text-white font-medium bg-black/60 px-6 py-3 rounded-full backdrop-blur-md shadow-xl transform transition-all duration-300 ${
                      isDragging ? 'opacity-100 scale-110' : 'translate-y-4 group-hover:translate-y-0'
                    }`}>
                      {isDragging ? '松开以更换图片' : '点击更换图片'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center">
                  <div className="bg-gradient-to-br from-[#e6fffa] to-white w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-[#2c7a7b]/10 group-hover:scale-110 group-hover:shadow-[#2c7a7b]/20 transition-all duration-300 border border-[#e6fffa]">
                    <Upload className="h-10 w-10 text-[#2c7a7b] group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                  <p className="font-bold text-2xl text-gray-800 mb-3 group-hover:text-[#2c7a7b] transition-colors">点击或拖拽上传图片</p>
                  <p className="text-gray-500 text-lg">{t('upload_desc')}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-fade-in-up">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            {preview && (
              <div className="mt-8 animate-fade-in-up">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnalyzeClick();
                  }} 
                  disabled={loading}
                  className={`w-full py-5 text-xl font-bold rounded-xl shadow-xl shadow-[#2c7a7b]/20 hover:shadow-2xl hover:shadow-[#2c7a7b]/30 transform transition-all duration-300 ${loading ? 'opacity-80 cursor-wait' : 'hover:-translate-y-1 active:scale-[0.99]'}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      {t('btn_analyzing')}...
                    </span>
                  ) : (
                    t('btn_analyze')
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Samples Section */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-8 border border-gray-100 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-50">
              <div className="bg-[#e6fffa] p-3 rounded-2xl shadow-sm">
                {analysisType === 'photo' ? <Camera className="h-6 w-6 text-[#2c7a7b]" /> : <Scan className="h-6 w-6 text-[#2c7a7b]" />}
              </div>
              <h3 className="font-bold text-2xl text-gray-800 tracking-tight">
                {analysisType === 'photo' ? t('sample_title') : t('sample_title_xray')}
              </h3>
            </div>

            <div className="flex-grow flex flex-col gap-6">
              {analysisType === 'photo' ? (
                <>
                  <div className="group p-0 rounded-2xl hover:bg-gray-50 transition-all duration-300 overflow-hidden border border-transparent hover:border-gray-100 hover:shadow-lg flex-1 flex flex-col">
                    <div className="h-40 w-full bg-[#f8fafc] flex items-center justify-center p-4 group-hover:bg-white transition-colors">
                      <div className="h-full w-full max-w-[200px]">
                        <GuideIllustrations.Standing />
                      </div>
                    </div>
                    <div className="p-5 flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#2c7a7b] text-white rounded-lg w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md shadow-[#2c7a7b]/20">A</span>
                        <h4 className="font-bold text-lg text-gray-800 group-hover:text-[#2c7a7b] transition-colors">{t('sample_standing')}</h4>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{t('sample_standing_desc')}</p>
                    </div>
                  </div>

                  <div className="group p-0 rounded-2xl hover:bg-gray-50 transition-all duration-300 overflow-hidden border border-transparent hover:border-gray-100 hover:shadow-lg flex-1 flex flex-col">
                    <div className="h-40 w-full bg-[#f8fafc] flex items-center justify-center p-4 group-hover:bg-white transition-colors">
                      <div className="h-full w-full max-w-[200px]">
                        <GuideIllustrations.Bending />
                      </div>
                    </div>
                    <div className="p-5 flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#2c7a7b] text-white rounded-lg w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md shadow-[#2c7a7b]/20">B</span>
                        <h4 className="font-bold text-lg text-gray-800 group-hover:text-[#2c7a7b] transition-colors">{t('sample_bending')}</h4>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{t('sample_bending_desc')}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="group p-0 rounded-2xl hover:bg-gray-50 transition-all duration-300 overflow-hidden border border-transparent hover:border-gray-100 hover:shadow-lg flex-1 flex flex-col">
                  <div className="h-60 w-full bg-[#f8fafc] flex items-center justify-center p-4 group-hover:bg-white transition-colors">
                    {/* Medical Imaging SVG */}
                    <svg viewBox="0 0 200 240" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* X-ray Film Background */}
                      <rect x="40" y="10" width="120" height="220" rx="4" fill="#1a202c" stroke="#4a5568" strokeWidth="2" />
                      
                      {/* Spine Structure - Ghostly White */}
                      <g className="animate-pulse-slow" opacity="0.9">
                        {/* Cervical */}
                        <path d="M100 25C95 25 95 30 100 30C105 30 105 25 100 25" fill="#e2e8f0" opacity="0.8"/>
                        <path d="M100 32C94 32 94 38 100 38C106 38 106 32 100 32" fill="#e2e8f0" opacity="0.8"/>
                        
                        {/* Thoracic - Mild Curve Suggestion */}
                        <path d="M100 45C92 45 92 55 100 55C108 55 108 45 100 45" fill="#e2e8f0" opacity="0.7"/>
                        <path d="M101 58C93 58 93 68 101 68C109 68 109 58 101 58" fill="#e2e8f0" opacity="0.7"/>
                        <path d="M102 71C94 71 94 81 102 81C110 81 110 71 102 71" fill="#e2e8f0" opacity="0.7"/>
                        
                        {/* Lumbar */}
                        <path d="M100 100C90 100 90 115 100 115C110 115 110 100 100 100" fill="#e2e8f0" opacity="0.9"/>
                        <path d="M99 118C89 118 89 133 99 133C109 133 109 118 99 118" fill="#e2e8f0" opacity="0.9"/>
                        <path d="M98 136C88 136 88 151 98 151C108 151 108 136 98 136" fill="#e2e8f0" opacity="0.9"/>
                        
                        {/* Pelvis Hint */}
                        <path d="M70 160C70 160 85 180 100 180C115 180 130 160 130 160" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
                      </g>

                      {/* Cobb Angle Measurement Lines - Overlay */}
                      <g className="animate-draw">
                        <line x1="60" y1="50" x2="140" y2="60" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 2" />
                        <line x1="60" y1="130" x2="140" y2="120" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 2" />
                        {/* Angle Arc */}
                        <path d="M130 60Q150 90 130 120" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.8"/>
                        <text x="145" y="95" fill="#fbbf24" fontSize="10" fontFamily="sans-serif">Cobb</text>
                      </g>
                      
                      <style>{`
                        .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
                        @keyframes pulse-slow { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
                      `}</style>
                    </svg>
                  </div>
                  <div className="p-5 flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#2c7a7b] text-white rounded-lg w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md shadow-[#2c7a7b]/20">X</span>
                      <h4 className="font-bold text-lg text-gray-800 group-hover:text-[#2c7a7b] transition-colors">{t('mode_xray')}</h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                       {t('sample_xray_desc')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-50 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{t('confirm_analyze_title')}</h3>
            </div>
            
            <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100/50 mb-8">
              <p className="text-gray-600 leading-relaxed text-lg">
                {t('confirm_analyze_desc')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={analyze}
                className="w-full py-4 text-lg font-bold shadow-lg shadow-[#2c7a7b]/20 hover:shadow-xl hover:shadow-[#2c7a7b]/30"
              >
                {t('btn_agree_analyze')}
              </Button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="w-full py-4 text-lg font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                {t('btn_cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
