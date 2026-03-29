'use client';

import { useSettings } from './SettingsContext';

interface SidebarProps {
  onOpenSettings: () => void;
}

export default function Sidebar({ onOpenSettings }: SidebarProps) {
  const { getThemeColors } = useSettings();
  const colors = getThemeColors();

  return (
    <>
      {/* Stars background */}
      <div className="starfield" />
      <div className="stars" />
      
      {/* Floating decorations */}
      <div className="planet-1 top-16 left-4 float-anim opacity-50 hidden lg:block" />
      <div className="planet-2 top-40 left-2 float-anim-slow opacity-30 hidden lg:block" style={{ animationDelay: '2s' }} />
      
      <aside className="h-full w-56 lg:w-56 glass-card flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
              style={{ background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)` }}
            >
              🤖
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-200">Cosmic</span>
              <span className="text-[10px] text-slate-400 block">AI Chat</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2">
          <div className="p-3 rounded-lg bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-2">Status</p>
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary, boxShadow: `0 0 8px ${colors.primary}` }}
              />
              <span className="text-xs text-slate-300">Connected</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-2">Features</p>
            <ul className="space-y-1 text-xs text-slate-500">
              <li className="flex items-center gap-1.5">
                <span>🦙</span> Ollama
              </li>
              <li className="flex items-center gap-1.5">
                <span>🤖</span> OpenAI
              </li>
              <li className="flex items-center gap-1.5">
                <span>🌐</span> OpenWebUI
              </li>
              <li className="flex items-center gap-1.5">
                <span>💻</span> OpenCode
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700/50 space-y-2">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
          >
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-slate-300">Settings</span>
          </button>
          
          <p className="text-[10px] text-slate-600 text-center">
            Cosmic Chat
          </p>
        </div>
      </aside>
    </>
  );
}
