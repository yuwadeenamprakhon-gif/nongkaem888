import React, { useState } from 'react';
import {
  Compass,
  Dice5,
  Heart,
  User,
  Shield,
  BarChart3,
  Calendar,
  Menu,
  X,
  MapPin,
  Sparkles,
  LogOut,
  FolderGit2,
  Palette
} from 'lucide-react';
import { Member } from '../types';
import { useTheme } from '../context/ThemeContext';
import { THEME_LIST } from '../data/themes';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: Member | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenDeployGuide: () => void;
  placesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenDeployGuide,
  placesCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setThemeId, setIsThemeModalOpen } = useTheme();

  const navItems = [
    { id: 'home', label: 'สุ่มที่เที่ยว', icon: Dice5, badge: 'HOT' },
    { id: 'directory', label: `สถานที่ (${placesCount})`, icon: Compass },
    { id: 'stats', label: 'แดชบอร์ด', icon: BarChart3, isStats: true, badge: 'Live' },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'admin', label: 'หลังบ้าน (Admin)', icon: Shield, badge: 'ผู้ดูแล', isAdmin: true }
  ];

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md border-b shadow-[0_4px_25px_rgba(0,0,0,0.4)] transition-colors duration-500"
      style={{
        backgroundColor: `${theme.navbarHex}ee`,
        borderColor: 'rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr ${theme.accentGradient} p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200`}
            >
              <div
                className="w-full h-full rounded-[14px] flex items-center justify-center"
                style={{ backgroundColor: theme.surfaceHex }}
              >
                <span className="text-xl sm:text-2xl animate-bounce">🎲</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}
                >
                  NongKaem888
                </span>
                <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${theme.badgeClass}`}>
                  ชลบุรี
                </span>
              </div>
              <p className="hidden sm:block text-[11px] sm:text-xs text-slate-400 font-medium leading-none mt-0.5">
                “วันนี้ไปไหนดี?” สุ่มที่เที่ยวออนไลน์
              </p>
            </div>
          </div>

          {/* Desktop Navigation (Laptops & Desktops) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                    isActive
                      ? `bg-white/15 ${theme.accentText} font-bold border border-white/30 shadow-md`
                      : item.isAdmin
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 hover:bg-amber-900/50 hover:text-white shadow-xs'
                      : item.isStats
                      ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40 hover:text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? theme.accentText
                        : item.isAdmin
                        ? 'text-amber-400'
                        : item.isStats
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        item.isAdmin
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : item.isStats
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : `bg-gradient-to-r ${theme.accentGradient} text-white`
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Theme Selector Button */}
            <button
              id="btn-theme-modal-nav"
              onClick={() => setIsThemeModalOpen(true)}
              title={`คลิกเพื่อเปลี่ยนธีมสีเว็บไซต์ (ปัจจุบัน: ${theme.thaiName})`}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-white shadow-xs transition-all hover:scale-105 active:scale-95 bg-white/10 hover:bg-white/20"
            >
              <Palette className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">ธีม: {theme.name.split(' ')[0]}</span>
              <span className="text-xs">{theme.icon}</span>
            </button>

            {/* GitHub / Deploy Guide Info */}
            <button
              id="btn-deploy-guide"
              onClick={onOpenDeployGuide}
              title="คู่มือ GitHub & Deploy Vercel"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
              <span>GitHub / Deploy</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-member-profile"
                  onClick={() => handleSelectTab('member')}
                  className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all ${
                    currentTab === 'member'
                      ? 'bg-white/15 border-white/40 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${theme.accentGradient} flex items-center justify-center text-white text-xs font-bold`}>
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate">
                    {currentUser.displayName}
                  </span>
                  {currentUser.favorites.length > 0 && (
                    <span className="flex items-center gap-0.5 text-[11px] font-bold text-pink-300 bg-pink-950/80 px-1.5 py-0.5 rounded-full border border-pink-500/30">
                      <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                      {currentUser.favorites.length}
                    </span>
                  )}
                </button>

                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="ออกจากระบบ"
                  className="p-2 text-slate-400 hover:text-pink-400 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-login-trigger"
                onClick={onOpenAuth}
                className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r ${theme.accentGradient} text-white text-xs sm:text-sm font-bold shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95`}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">เข้าสู่ระบบ</span>
                <span className="hidden sm:inline"> / สมาชิก</span>
              </button>
            )}

            {/* Mobile & Tablet Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-white/10 px-4 pt-3 pb-5 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200"
          style={{ backgroundColor: theme.surfaceHex }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? `bg-gradient-to-r ${theme.accentGradient} text-white font-bold shadow-md`
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-slate-900' : 'bg-pink-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Mobile Theme Switcher Strip */}
          <div className="pt-2 pb-1 border-t border-white/10">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-300" />
                <span>เปลี่ยนธีมสีเว็บไซต์:</span>
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsThemeModalOpen(true);
                }}
                className="text-[11px] text-pink-300 hover:underline"
              >
                ดูรายละเอียด
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {THEME_LIST.map((t) => {
                const isSelected = theme.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-bold border transition-all ${
                      isSelected
                        ? 'bg-white/20 border-white text-white shadow-md'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{t.icon}</span>
                    <span className="truncate max-w-[50px] mt-0.5">{t.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenDeployGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <FolderGit2 className="w-4 h-4 text-slate-400" />
              <span>คู่มือ GitHub & Deploy Vercel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
