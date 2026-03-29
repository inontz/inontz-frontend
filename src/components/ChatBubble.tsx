'use client';

import { useState } from 'react';
import { useSettings, type Message } from './SettingsContext';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const { getThemeColors } = useSettings();
  const colors = getThemeColors();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm relative ${
          isUser
            ? 'text-slate-100'
            : 'text-slate-300'
        }`}
        style={{
          background: isUser 
            ? `linear-gradient(135deg, ${colors.primary}60, ${colors.secondary}60)` 
            : 'rgba(30, 41, 59, 0.7)',
          borderLeft: isUser ? undefined : `2px solid ${colors.primary}`,
        }}
      >
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>
        
        <div className={`flex items-center gap-2 mt-1.5 ${isUser ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-white/10 transition-colors text-slate-400 hover:text-slate-200"
            title="Copy"
          >
            {copied ? (
              <svg className="w-3 h-3 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          
          <span className="text-[9px] text-slate-500">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
