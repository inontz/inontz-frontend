'use client';

import { useState, useRef, useEffect } from 'react';
import { useSettings, Message } from './SettingsContext';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';

interface ChatContainerProps {
  onOpenSettings: () => void;
}

export default function ChatContainer({ onOpenSettings }: ChatContainerProps) {
  const { endpoint, apiKey, selectedModel, getThemeColors } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = getThemeColors();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSend = async (content: string) => {
    if (!endpoint || !selectedModel) {
      setError('Please select a model');
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const assistantMessageId = generateId();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint,
          apiKey,
          model: selectedModel,
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as { error?: string };
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') continue;
              
              const data = JSON.parse(dataStr);
              const content = data.choices?.[0]?.delta?.content || data.choices?.[0]?.message?.content;
              if (content) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + content }
                      : msg
                  )
                );
              }
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: `Error: ${err instanceof Error ? err.message : 'Failed'}` }
            : msg
        )
      );
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 aurora-bg pointer-events-none" />
      
      {/* Header */}
      <ChatHeader onOpenSettings={onOpenSettings} />

      {/* Error Message */}
      {error && (
        <div className="mx-3 mt-2 p-2 rounded-md bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">{error}</span>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto p-3 space-y-3 relative overscroll-contain"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.primary}05 0%, transparent 50%)`,
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[200px]">
            <div className="text-center space-y-2">
              <div 
                className="text-3xl mb-3"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                🤖
              </div>
              <p className="text-sm font-medium text-slate-300">Ready to chat</p>
              <p className="text-xs text-slate-500 px-4">
                Select a model from the header to start
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div 
                  className="glass-card rounded-lg rounded-bl-sm px-3 py-2"
                  style={{ boxShadow: `0 0 10px ${colors.primary}20` }}
                >
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.primary, animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.secondary, animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Bar */}
      <div className="px-3 py-2 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between flex-shrink-0">
        <button
          onClick={handleClear}
          disabled={messages.length === 0}
          className="text-[10px] text-slate-500 hover:text-slate-300 disabled:opacity-50 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear
        </button>
        <span className="text-[10px] text-slate-500">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </span>
      </div>

      <ChatInput onSend={handleSend} isLoading={isLoading} disabled={!selectedModel} />
    </div>
  );
}
