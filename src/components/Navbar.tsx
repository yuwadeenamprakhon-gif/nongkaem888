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
  FolderGit2
} from 'lucide-react';
import { Member } from '../types';

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

  const navItems = [
    { id: 'home', label: 'สุ่มที่เที่ยว', icon: Dice5, badge: 'HOT' },
    { id: 'directory', label: `สถานที่ (${placesCount})`, icon: Compass },
    { id: 'stats', label: 'แดชบอร์ด', icon: BarChart3 },
    { id: 'timeline', label: 'Project Timeline', icon: Calendar },
    { id: 'admin', label: 'หลังบ้าน / ดูคนสมัคร (Admin)', icon: Shield, badge: 'ดูสมาชิก' }
  ];

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090b1e]/90 backdrop-blur-md border-b border-purple-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 p-0.5 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#0d0f26] rounded-[14px] flex items-center justify-center">
                <span className="text-xl sm:text-2xl animate-bounce">🎲</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  NongKaem888
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-950 text-pink-300 border border-purple-500/40">
                  ชลบุรี
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-none mt-0.5">
                “วันนี้ไปไหนดี?” สุ่มที่เที่ยวออนไลน์
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-pink-300 font-bold border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-purple-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* GitHub / Deploy Guide Info */}
            <button
              id="btn-deploy-guide"
              onClick={onOpenDeployGuide}
              title="คู่มือ GitHub & Deploy Vercel"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 text-xs font-medium text-slate-300 hover:bg-purple-950/50 hover:text-pink-300 transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
              <span>GitHub / Deploy</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-member-profile"
                  onClick={() => handleSelectTab('member')}
                  className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all ${
                    currentTab === 'member'
                      ? 'bg-purple-950 border-pink-500 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                      : 'bg-[#121435] border-purple-500/30 text-slate-200 hover:bg-purple-950'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
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
                  className="p-2 text-slate-400 hover:text-pink-400 hover:bg-purple-950/50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-login-trigger"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(217,70,239,0.35)] hover:from-purple-500 hover:to-pink-400 transition-all duration-200 active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ / สมาชิก</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-purple-950/60 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-500/20 bg-[#0d0f28] px-4 pt-3 pb-5 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-md'
                    : 'text-slate-300 hover:bg-purple-950/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-purple-900' : 'bg-pink-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-purple-900/30 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenDeployGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-purple-200 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30"
            >
              <FolderGit2 className="w-4 h-4 text-pink-400" />
              <span>คู่มือ GitHub & Deploy Vercel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
