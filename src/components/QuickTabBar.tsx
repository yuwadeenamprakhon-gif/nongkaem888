import React from 'react';
import { Dice5, Compass, BarChart3, Shield, Calendar, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface QuickTabBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  placesCount: number;
}

export const QuickTabBar: React.FC<QuickTabBarProps> = ({
  currentTab,
  setCurrentTab,
  placesCount
}) => {
  const { theme } = useTheme();

  const tabs = [
    {
      id: 'home',
      fullLabel: 'สุ่มที่เที่ยว',
      shortLabel: 'สุ่มที่เที่ยว',
      icon: Dice5,
      tag: 'หลัก',
      tagColor: 'bg-white/10 text-white'
    },
    {
      id: 'directory',
      fullLabel: `ค้นหาสถานที่ (${placesCount})`,
      shortLabel: `สถานที่ (${placesCount})`,
      icon: Compass,
      tag: `${placesCount} แห่ง`,
      tagColor: 'bg-sky-500/20 text-sky-300'
    },
    {
      id: 'stats',
      fullLabel: 'แดชบอร์ดสถิติ',
      shortLabel: 'แดชบอร์ด',
      icon: BarChart3,
      tag: 'Live',
      tagColor: 'bg-emerald-500/20 text-emerald-300',
      isHighlight: true
    },
    {
      id: 'admin',
      fullLabel: 'ระบบหลังบ้าน (Admin)',
      shortLabel: 'หลังบ้าน Admin',
      icon: Shield,
      tag: 'ผู้ดูแล',
      tagColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      isAdmin: true
    },
    {
      id: 'timeline',
      fullLabel: 'Project Timeline',
      shortLabel: 'ไทม์ไลน์',
      icon: Calendar,
      tag: 'Phase 1-4',
      tagColor: 'bg-purple-500/20 text-purple-300'
    }
  ];

  return (
    <div className="w-full mb-4 sm:mb-6">
      {/* Container with backdrop */}
      <div
        className="p-1 sm:p-2 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300"
        style={{
          backgroundColor: `${theme.surfaceHex}cc`,
          borderColor: 'rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Horizontal scroll container with touch momentum */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5 scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`quick-tab-${tab.id}`}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex-1 min-w-[110px] sm:min-w-[130px] lg:min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 select-none whitespace-nowrap active:scale-95 ${
                  isActive
                    ? `bg-gradient-to-r ${theme.accentGradient} text-white shadow-md shadow-pink-500/20 scale-[1.02] border border-white/30`
                    : tab.isAdmin
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/40 hover:border-amber-400/50'
                    : tab.isHighlight
                    ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                    isActive
                      ? 'text-white'
                      : tab.isAdmin
                      ? 'text-amber-400'
                      : tab.isHighlight
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                />
                <span className="hidden sm:inline">{tab.fullLabel}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>

                {/* Sub-tag badge */}
                {tab.tag && (
                  <span
                    className={`hidden xl:inline text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                      isActive ? 'bg-black/30 text-white' : tab.tagColor
                    }`}
                  >
                    {tab.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
