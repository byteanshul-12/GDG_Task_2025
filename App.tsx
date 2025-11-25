import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import GDGPage from './components/GDGPage';
import { LayoutGrid } from 'lucide-react';

type AppMode = 'campus' | 'gdg';
type Page = 'landing' | 'dashboard';

export default function App() {
  // Defaulting to 'gdg' for Task 2 demonstration
  const [appMode, setAppMode] = useState<AppMode>('gdg');
  const [page, setPage] = useState<Page>('landing');

  return (
    <div className="relative">
      
      {/* Task Switcher (Floating) */}
      <div className="fixed top-4 left-4 z-[100] flex flex-col gap-2 group">
         <button className="bg-slate-900 text-white p-2 rounded-full shadow-lg opacity-30 hover:opacity-100 transition-opacity">
            <LayoutGrid size={20} />
         </button>
         <div className="hidden group-hover:flex flex-col gap-2 bg-white p-2 rounded-xl shadow-xl border border-slate-200 animate-in fade-in slide-in-from-left-2">
            <button 
                onClick={() => setAppMode('campus')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${appMode === 'campus' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
            >
                CampusSpot (Task 1)
            </button>
            <button 
                onClick={() => setAppMode('gdg')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${appMode === 'gdg' ? 'bg-[#4285F4] text-white' : 'hover:bg-slate-100 text-slate-700'}`}
            >
                GDG Event (Task 2)
            </button>
         </div>
      </div>

      {/* Render Application Based on Mode */}
      {appMode === 'gdg' ? (
        <GDGPage />
      ) : (
        <>
          {page === 'landing' ? (
            <LandingPage onLaunch={() => setPage('dashboard')} />
          ) : (
            <Dashboard onLogout={() => setPage('landing')} />
          )}
        </>
      )}
    </div>
  );
}