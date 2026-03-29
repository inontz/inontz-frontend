'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from "@/components/Sidebar";
import SettingsModal from "@/components/SettingsModal";

const ChatContainer = dynamic(() => import("@/components/ChatContainer"), { ssr: false });

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen h-[100dvh] w-screen overflow-hidden bg-slate-950 safe-area-top safe-area-bottom safe-area-left safe-area-right">
      {/* Sidebar - hidden on mobile, toggleable */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        lg:relative lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          onOpenSettings={() => {
            setShowSettings(true);
            setIsMobileMenuOpen(false);
          }}
        />
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-slate-950/50 overflow-hidden relative">
        {/* Mobile header with menu button */}
        <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md hover:bg-slate-700/50 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-medium text-slate-200">Cosmic Chat</span>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-md hover:bg-slate-700/50 transition-colors"
            aria-label="Settings"
          >
            <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <ChatContainer onOpenSettings={() => setShowSettings(true)} />
      </main>
      
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
