'use client';

import { useState } from 'react';
import { useSettings, THEME_COLORS } from './SettingsContext';

interface SettingsModalProps {
  onClose: () => void;
}

const themeOptions: { color: keyof typeof THEME_COLORS; icon: string; label: string }[] = [
  { color: 'indigo', icon: '💜', label: 'Indigo' },
  { color: 'purple', icon: '🔮', label: 'Purple' },
  { color: 'pink', icon: '🌸', label: 'Pink' },
  { color: 'blue', icon: '💙', label: 'Blue' },
  { color: 'emerald', icon: '💚', label: 'Emerald' },
  { color: 'orange', icon: '🧡', label: 'Orange' },
];

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { 
    endpoint, 
    apiKey, 
    themeColor,
    setEndpoint, 
    setApiKey,
    setThemeColor,
    getThemeColors
  } = useSettings();
  
  const [currentEndpoint, setCurrentEndpoint] = useState(endpoint);
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const colors = getThemeColors();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setMessage(null);

    try {
      const headers: Record<string, string> = {};
      if (currentApiKey) headers['Authorization'] = `Bearer ${currentApiKey}`;

      const response = await fetch(`${currentEndpoint}/api/v1/models`, { headers });

      if (response.ok) {
        setEndpoint(currentEndpoint);
        setApiKey(currentApiKey);
        setMessage('✅ Connected successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage(`❌ Connection failed: ${response.status}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err instanceof Error ? err.message : 'Failed to connect'}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative glass-card rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: `0 0 40px ${colors.primary}30` }}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)` }}
            >
              🌐
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Settings</h2>
              <p className="text-[10px] text-slate-400">OpenWebUI Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Theme Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {themeOptions.map((theme) => (
                  <button
                    key={theme.color}
                    type="button"
                    onClick={() => setThemeColor(theme.color)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 ${
                      themeColor === theme.color
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${THEME_COLORS[theme.color].primary}, ${THEME_COLORS[theme.color].secondary})`,
                    }}
                    title={theme.label}
                  >
                    {theme.icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">OpenWebUI Endpoint</label>
              <input
                type="url"
                value={currentEndpoint}
                onChange={(e) => setCurrentEndpoint(e.target.value)}
                placeholder="https://openwebui.inontz.me"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">API Key (Optional)</label>
              <input
                type="password"
                value={currentApiKey}
                onChange={(e) => setCurrentApiKey(e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-500"
              />
            </div>

            {message && (
              <div className={`p-2.5 rounded-lg text-xs ${
                message.includes('✅') 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isTesting}
                className="flex-1 px-3 py-2.5 rounded-lg text-xs text-white font-medium transition-all duration-200 disabled:opacity-50 min-h-[44px]"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                {isTesting ? 'Testing...' : 'Save & Connect'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2.5 rounded-lg bg-slate-700/50 text-xs text-slate-300 hover:bg-slate-700 transition-colors min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-800/30 flex-shrink-0">
          <p className="text-[10px] text-slate-500 text-center">
            🌐 OpenWebUI • {endpoint.replace('https://', '')}
          </p>
        </div>
      </div>
    </div>
  );
}
