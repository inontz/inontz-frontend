'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeColor = 'indigo' | 'purple' | 'pink' | 'blue' | 'emerald' | 'orange';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface SettingsContextType {
  endpoint: string;
  apiKey: string;
  selectedModel: string | null;
  themeColor: ThemeColor;
  setEndpoint: (endpoint: string) => void;
  setApiKey: (apiKey: string) => void;
  setSelectedModel: (model: string | null) => void;
  setThemeColor: (color: ThemeColor) => void;
  getThemeColors: () => { primary: string; secondary: string; accent: string };
}

const DEFAULT_ENDPOINT = 'https://openwebui.inontz.me';

const THEME_COLORS: Record<ThemeColor, { primary: string; secondary: string; accent: string }> = {
  indigo: { primary: '#6366f1', secondary: '#a855f7', accent: '#ec4899' },
  purple: { primary: '#9333ea', secondary: '#c084fc', accent: '#f472b6' },
  pink: { primary: '#db2777', secondary: '#f472b6', accent: '#fb7185' },
  blue: { primary: '#3b82f6', secondary: '#60a5fa', accent: '#818cf8' },
  emerald: { primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7' },
  orange: { primary: '#f97316', secondary: '#fb923c', accent: '#fdba74' },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [endpoint, setEndpointState] = useState(DEFAULT_ENDPOINT);
  const [apiKey, setApiKeyState] = useState('');
  const [selectedModel, setSelectedModelState] = useState<string | null>(null);
  const [themeColor, setThemeColorState] = useState<ThemeColor>('indigo');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedEndpoint = localStorage.getItem('endpoint');
    const storedApiKey = localStorage.getItem('api-key');
    const storedModel = localStorage.getItem('selected-model');
    const storedTheme = localStorage.getItem('theme-color') as ThemeColor;

    if (storedEndpoint) {
      setEndpointState(storedEndpoint);
    }

    if (storedApiKey) {
      setApiKeyState(storedApiKey);
    }

    if (storedModel) {
      setSelectedModelState(storedModel);
    }

    if (storedTheme && ['indigo', 'purple', 'pink', 'blue', 'emerald', 'orange'].includes(storedTheme)) {
      setThemeColorState(storedTheme);
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('endpoint', endpoint);
    }
  }, [endpoint, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      if (apiKey) {
        localStorage.setItem('api-key', apiKey);
      } else {
        localStorage.removeItem('api-key');
      }
    }
  }, [apiKey, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      if (selectedModel) {
        localStorage.setItem('selected-model', selectedModel);
      } else {
        localStorage.removeItem('selected-model');
      }
    }
  }, [selectedModel, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('theme-color', themeColor);
      const colors = THEME_COLORS[themeColor];
      document.documentElement.style.setProperty('--theme-primary', colors.primary);
      document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
      document.documentElement.style.setProperty('--theme-accent', colors.accent);
    }
  }, [themeColor, isInitialized]);

  const setEndpoint = (newEndpoint: string) => {
    setEndpointState(newEndpoint);
  };

  const setApiKey = (newApiKey: string) => {
    setApiKeyState(newApiKey);
  };

  const setSelectedModel = (model: string | null) => {
    setSelectedModelState(model);
  };

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
  };

  const getThemeColors = () => {
    return THEME_COLORS[themeColor];
  };

  return (
    <SettingsContext.Provider
      value={{
        endpoint,
        apiKey,
        selectedModel,
        themeColor,
        setEndpoint,
        setApiKey,
        setSelectedModel,
        setThemeColor,
        getThemeColors,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export { THEME_COLORS };
