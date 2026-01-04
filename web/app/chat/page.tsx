'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot, Loader2, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/Button';
import { ChatMessage } from '@/lib/models/types';

export default function ChatPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial welcome message using translation
    setMessages([
      { role: 'assistant', content: t('chat_welcome') || '你好！我是您的脊柱健康助手。有什么关于脊柱侧弯、体态矫正或康复训练的问题，都可以问我哦。' }
    ]);
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare context: keep last 10 messages to avoid token limits
      const contextMessages = [...messages, userMessage].slice(-10);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: contextMessages, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我现在遇到了一些问题，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const presetQuestions = [
    t('preset_q1'),
    t('preset_q2'),
    t('preset_q3'),
    t('preset_q4'),
  ].filter(Boolean);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#f8f9fa]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-8 py-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm overflow-hidden ${
                msg.role === 'user' ? 'bg-[#2c7a7b]' : 'bg-white border border-gray-100'
              }`}>
                {msg.role === 'user' ? (
                  <User className="h-6 w-6 text-white" />
                ) : (
                  <Bot className="h-6 w-6 text-[#2c7a7b]" />
                )}
              </div>
              
              <div className={`relative max-w-[85%] md:max-w-[75%] px-5 py-3.5 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#2c7a7b] text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-gray-800 prose-a:text-[#2c7a7b] prose-strong:text-gray-900">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 mt-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-3" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#2c7a7b] pl-4 italic my-2 bg-gray-50 py-2 rounded-r" {...props} />,
                        code: ({node, inline, className, children, ...props}: any) => {
                          return inline ? (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-red-500" {...props}>
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-gray-800 text-white p-3 rounded-lg text-sm font-mono overflow-x-auto my-2" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-4">
               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                 <Bot className="h-6 w-6 text-[#2c7a7b]" />
               </div>
               <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
                 <div className="flex gap-1">
                   <span className="w-2 h-2 bg-[#2c7a7b] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                   <span className="w-2 h-2 bg-[#2c7a7b] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                   <span className="w-2 h-2 bg-[#2c7a7b] rounded-full animate-bounce"></span>
                 </div>
               </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:pb-6">
        <div className="max-w-3xl mx-auto">
          {/* Preset Questions */}
          {messages.length < 3 && !isLoading && (
            <div className="mb-6 flex flex-wrap justify-center gap-3 animate-fade-in-up">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-4 py-2 bg-white hover:bg-[#e6fffa] hover:text-[#2c7a7b] hover:border-[#2c7a7b]/30 border border-gray-200 rounded-xl text-sm text-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="relative bg-white p-2 rounded-2xl shadow-lg border border-gray-100 focus-within:ring-2 focus-within:ring-[#2c7a7b]/10 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat_placeholder') || "输入您的问题..."}
              className="w-full pl-3 pr-14 py-3 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[52px] text-gray-700 placeholder-gray-400 text-base outline-none ring-0 focus:outline-none"
              rows={1}
              disabled={isLoading}
              style={{ height: 'auto', minHeight: '52px' }}
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-2">
              <button 
                onClick={() => handleSend()} 
                disabled={isLoading || !input.trim()}
                className={`w-10 h-10 flex items-center justify-center transition-all disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 text-[#2c7a7b] animate-spin" />
                ) : (
                  <Image 
                    src="/send.png" 
                    alt="Send" 
                    width={32} 
                    height={32}
                    className={`transition-all duration-300 ${
                      input.trim() ? 'opacity-100 hover:scale-110' : 'opacity-30 grayscale'
                    }`}
                  />
                )}
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            AI 生成内容仅供参考，不作为医疗诊断依据
          </p>
        </div>
      </div>
    </div>
  );
}
