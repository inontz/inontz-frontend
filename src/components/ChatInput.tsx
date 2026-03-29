'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useSettings } from './SettingsContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { getThemeColors } = useSettings();
  const colors = getThemeColors();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Auto-focus on mobile when ready
  useEffect(() => {
    if (!disabled && textareaRef.current && window.innerWidth < 640) {
      // Only focus on mobile if user has interacted with the app
      const hasInteracted = sessionStorage.getItem('hasInteracted');
      if (hasInteracted) {
        textareaRef.current.focus();
      }
    }
  }, [disabled]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled) return;
    
    // Mark as interacted for mobile focus management
    sessionStorage.setItem('hasInteracted', 'true');
    
    onSend(message.trim());
    setMessage('');
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (without shift) for desktop
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 640) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative border-t border-slate-700/50 bg-slate-900/50 p-3 safe-area-bottom"
    >
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Select a model first" : "Type a message..."}
            disabled={disabled}
            rows={1}
            enterKeyHint="send"
            className="w-full px-3 py-2.5 pr-10 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder:text-slate-600 disabled:opacity-50 resize-none focus:outline-none focus:border-slate-500 transition-colors min-h-[44px]"
            style={{ maxHeight: '120px' }}
          />
          <div 
            className="absolute right-2.5 top-2.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: disabled ? '#ef4444' : colors.primary }}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="flex-shrink-0 p-3 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          }}
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="flex gap-0.5">
              <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
              <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
            </div>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
