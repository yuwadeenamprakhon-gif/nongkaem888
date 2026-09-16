import React from 'react';
import { X, Palette, Check, Sparkles } from 'lucide-react';
import { THEME_LIST } from '../data/themes';
import { useTheme } from '../context/ThemeContext';

export const ThemeModal: React.FC = () => {
  const { themeId, theme, setThemeId, isThemeModalOpen, setIsThemeModalOpen } = useTheme();

  if (!isThemeModalOpen) return null;

  return (
    <div
      id="theme-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsThemeModalOpen(false)}
    >
      <div
        id="theme-modal-container"
        className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10"
        style={{ backgroundColor: theme.surfaceHex }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with theme gradient */}
        <div className={`p-6 bg-gradient-to-r ${theme.accentGradient} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-md">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">เลือกธีมและโทนสีเว็บไซต์</h3>
              <p className="text-xs text-white/80">ปรับแต่งบรรยากาศสีสันตามสไตล์ที่คุณชอบ</p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme List */}
        <div className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
          {THEME_LIST.map((t) => {
            const isSelected = themeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setThemeId(t.id);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden group flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-white/40 ring-2 ring-white/30 shadow-lg'
                    : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.2)'
                }}
              >
                {/* Left info */}
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner border border-white/10"
                    style={{ backgroundColor: t.bgHex }}
                  >
                    {t.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">{t.thaiName}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          กำลังใช้งาน
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{t.description}</p>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      {t.colorSwatch.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <div
                        className={`h-2.5 w-16 rounded-full bg-gradient-to-r ${t.accentGradient} ml-1 opacity-80`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Selector Check */}
                <div className="shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-tr ' + t.accentGradient + ' text-white border-transparent shadow-md scale-110'
                        : 'border-white/20 text-transparent group-hover:border-white/40'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 bg-black/30 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ธีมที่เลือกจะถูกบันทึกไว้ในเบราว์เซอร์อัตโนมัติ</span>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};
