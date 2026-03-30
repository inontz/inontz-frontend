'use client';

import { useState, useEffect, useRef } from 'react';
import { useSettings } from './SettingsContext';

interface Model {
  id: string;
  name: string;
  description?: string;
  size?: number;
}

interface ChatHeaderProps {
  onOpenSettings: () => void;
}

export default function ChatHeader({ onOpenSettings }: ChatHeaderProps) {
  const { 
    endpoint, 
    apiKey, 
    selectedModel, 
    setSelectedModel, 
  } = useSettings();
  
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchModels = async () => {
      if (!endpoint) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const headers: Record<string, string> = {};
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

        const response = await fetch(`${endpoint}/api/v1/models`, { headers });

        if (response.ok) {
          const data = await response.json() as Record<string, unknown>;
          let modelArray: unknown[] = [];
          
          if (Array.isArray(data)) {
            modelArray = data;
          } else if (data.models && Array.isArray(data.models)) {
            modelArray = data.models;
          } else if (data.data && Array.isArray(data.data)) {
            modelArray = data.data;
          } else {
            for (const key of Object.keys(data)) {
              if (Array.isArray(data[key])) {
                modelArray = data[key];
                break;
              }
            }
          }

          const fetchedModels = modelArray.map((m: any) => ({
            id: m.id || m.name || m.model || 'unknown',
            name: m.name || m.id || m.model || 'Unknown',
            description: m.description || m.details?.parameter_size || m.parameter_size,
          }));

          setModels(fetchedModels);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [endpoint, apiKey]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    setIsOpen(false);
  };

  return (
    <div className="px-3 py-2 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors text-left flex-shrink-0"
        >
          <span>🌐</span>
          <span className="text-xs font-medium text-slate-200">OpenWebUI</span>
        </button>

        <div className="h-5 w-px bg-slate-700/50 flex-shrink-0" />

        <div className="relative flex-1 min-w-0" ref={dropdownRef}>
          <button
            ref={triggerRef}
            onClick={() => !isLoading && setIsOpen(!isOpen)}
            disabled={isLoading}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 text-left"
          >
            <span className="text-sm text-slate-200 truncate">
              {isLoading ? 'Loading...' : selectedModel || 'Select model'}
            </span>
            <span className="ml-2 flex-shrink-0 text-slate-400">
              {isOpen ? '▲' : '▼'}
            </span>
          </button>

          {isOpen && (
            <div 
              className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50"
            >
              {error ? (
                <div className="p-3 text-sm text-red-400">
                  Error: {error}
                </div>
              ) : models.length === 0 ? (
                <div className="p-3 text-sm text-slate-400">
                  No models found
                </div>
              ) : (
                models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleSelectModel(model.id)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700 transition-colors ${
                      selectedModel === model.id ? 'bg-slate-700 text-white' : 'text-slate-300'
                    }`}
                  >
                    <div className="font-medium truncate">{model.name}</div>
                    {model.description && (
                      <div className="text-xs text-slate-500 truncate">
                        {model.description}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div 
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ 
            backgroundColor: selectedModel ? '#10b981' : '#ef4444',
          }}
        />
      </div>
    </div>
  );
}
