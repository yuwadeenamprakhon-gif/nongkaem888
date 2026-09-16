import React from 'react';
import { Dice5, Compass, BarChart3, Shield, User, Calendar } from 'lucide-react';
import { Member } from '../types';
import { useTheme } from '../context/ThemeContext';

interface BottomNavBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: Member | null;
  onOpenAuth: () => void;
  placesCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  placesCount
}) => {
  const { theme } = useTheme();

  const items = [
    {
      id: 'home',
      label: 'สุ่มที่เที่ยว',
      icon: Dice5,
      isSpecial: false
    },
    {
      id: 'directory',
      label: 'สถานที่',
      badge: `${placesCount}`,
      icon: Compass,
      isSpecial: false
    },
    {
      id: 'stats',
      label: 'แดชบอร์ด',
      icon: BarChart3,
      isSpecial: false
    },
    {
      id: 'admin',
      label: 'หลังบ้าน',
      badge: 'Admin',
      icon: Shield,
      isSpecial: true
    },
    {
      id: 'member',
      label: currentUser ? currentUser.displayName.slice(0, 6) : 'สมาชิก',
      icon: User,
      isSpecial: false,
      onClick: () => {
        if (!currentUser) {
          onOpenAuth();
        } else {
          setCurrentTab('member');
        }
      }
    }
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl transition-colors duration-500 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom,4px)]"
      style={{
        backgroundColor: `${theme.navbarHex}f8`,
        borderColor: 'rgba(255, 255, 255, 0.12)'
      }}
    >
      <div className="max-w-md md:max-w-lg mx-auto px-2 sm:px-4 py-1.5 flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  setCurrentTab(item.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Highlight background pill for active or special tab */}
              {item.isSpecial ? (
                <div
                  className={`relative p-1.5 rounded-xl transition-all ${
                    isActive
                      ? `bg-gradient-to-tr ${theme.accentGradient} text-white shadow-lg scale-110`
                      : 'bg-white/10 text-amber-300 border border-amber-400/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-rose-500 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              ) : (
                <div
                  className={`relative p-1.5 rounded-xl transition-all ${
                    isActive
                      ? `bg-white/15 ${theme.accentText} scale-105`
                      : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[8px] font-bold bg-white/20 text-slate-200">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap font-medium ${
                  isActive ? 'font-bold text-white' : item.isSpecial ? 'text-amber-300 font-bold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 bg-gradient-to-r ${theme.accentGradient}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
