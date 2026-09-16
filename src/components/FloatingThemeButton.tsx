import React, { useState } from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { THEME_LIST } from '../data/themes';

export const FloatingThemeButton: React.FC = () => {
  const { theme, setThemeId, setIsThemeModalOpen } = useTheme();
  const [isQuickOpen, setIsQuickOpen] = useState(false);

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
      {/* Quick Theme Picker Popover */}
      {isQuickOpen && (
        <div
          className="p-3 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-2 mb-1"
          style={{ backgroundColor: theme.surfaceHex }}
        >
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span>เลือกธีมสี</span>
            </span>
            <button
              onClick={() => {
                setIsQuickOpen(false);
                setIsThemeModalOpen(true);
              }}
              className="text-[10px] text-pink-300 hover:underline"
            >
              ดูทั้งหมด
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1.5 min-w-[170px]">
            {THEME_LIST.map((t) => {
              const isSelected = theme.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setThemeId(t.id);
                    setIsQuickOpen(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-white/15 text-white font-bold border border-white/30'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{t.icon}</span>
                    <span className="truncate">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {t.colorSwatch.map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-black/30"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Floating Trigger Pill */}
      <button
        id="btn-floating-theme"
        onClick={() => setIsQuickOpen(!isQuickOpen)}
        title="เปลี่ยนธีมสีเว็บไซต์"
        className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-2xl border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 text-white text-xs font-bold bg-gradient-to-r ${theme.accentGradient}`}
      >
        <span className="text-base">{theme.icon}</span>
        <span className="hidden sm:inline">เปลี่ยนธีม: {theme.name}</span>
        <Palette className="w-3.5 h-3.5 opacity-90 group-hover:rotate-45 transition-transform" />
      </button>
    </div>
  );
};
