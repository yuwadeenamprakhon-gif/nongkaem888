import React, { useState, useEffect, useCallback } from 'react';
import { Place, Member, FilterType, AppStats } from './types';
import { INITIAL_PLACES } from './data/places';
import { ApiService } from './services/apiService';
import { RandomService } from './services/randomService';
import { Navbar } from './components/Navbar';
import { LuckyDrawModal } from './components/LuckyDrawModal';
import { ResultModal } from './components/ResultModal';
import { AuthModal } from './components/AuthModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { ThemeModal } from './components/ThemeModal';
import { FloatingThemeButton } from './components/FloatingThemeButton';
import { useTheme } from './context/ThemeContext';
import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { AdminPage } from './pages/AdminPage';
import { MemberPage } from './pages/MemberPage';
import { TimelinePage } from './pages/TimelinePage';
import { StatsPage } from './pages/StatsPage';
import { Compass, Heart, Shield, Sparkles, MapPin, Dice5 } from 'lucide-react';

export default function App() {
  const { theme } = useTheme();
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [stats, setStats] = useState<AppStats | null>(null);

  // Randomizer & Animation state
  const [isLuckyDrawOpen, setIsLuckyDrawOpen] = useState(false);
  const [luckySequence, setLuckySequence] = useState<Place[]>([]);
  const [luckyWinner, setLuckyWinner] = useState<Place | null>(null);
  const [currentFilterUsed, setCurrentFilterUsed] = useState<FilterType>('all');
  const [currentDistrictUsed, setCurrentDistrictUsed] = useState<string>('ทั้งหมด');

  // Modals
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  // Load places and initial session
  const refreshPlaces = useCallback(async () => {
    try {
      const data = await ApiService.getPlaces();
      if (data && data.length > 0) {
        setPlaces(data);
      }
      const s = await ApiService.getStats();
      setStats(s);
    } catch (e) {
      console.warn('Error loading places:', e);
    }
  }, []);

  useEffect(() => {
    refreshPlaces();
    const user = ApiService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setFavorites(user.favorites || []);
    } else {
      // Local stored favorites
      try {
        const localFavs = localStorage.getItem('nongkaem888_local_favs');
        if (localFavs) setFavorites(JSON.parse(localFavs));
      } catch {}
    }
  }, [refreshPlaces]);

  // Handle Trigger Random
  const handleTriggerRandom = (filterType: FilterType, district: string) => {
    setCurrentFilterUsed(filterType);
    setCurrentDistrictUsed(district);

    // Pick winner using the random engine
    const winner = RandomService.pickRandom(places, {
      filterType,
      district,
      excludeId: selectedPlace ? selectedPlace.id : undefined
    });

    if (!winner) {
      alert('ไม่พบสถานที่ที่ตรงกับเงื่อนไข ลองเลือกพื้นที่หรือหมวดหมู่อื่นดูนะ');
      return;
    }

    // Build rapid cycling sequence
    const sequence = RandomService.getCyclingSequence(places, winner, 24);
    setLuckyWinner(winner);
    setLuckySequence(sequence);
    setIsResultOpen(false);
    setIsLuckyDrawOpen(true);
  };

  // When Lucky Draw finishes animation
  const handleLuckyDrawFinished = () => {
    setIsLuckyDrawOpen(false);
    if (luckyWinner) {
      setSelectedPlace(luckyWinner);
      setIsResultOpen(true);

      // Record roll in API & local stats
      ApiService.recordRoll(
        luckyWinner.id,
        currentUser?.id,
        `${currentFilterUsed} - ${currentDistrictUsed}`
      );
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (placeId: string) => {
    if (currentUser) {
      const updated = await ApiService.toggleFavorite(placeId, currentUser.id);
      setFavorites(updated);
    } else {
      // Offline / guest toggle
      let nextFavs: string[] = [];
      if (favorites.includes(placeId)) {
        nextFavs = favorites.filter((id) => id !== placeId);
      } else {
        nextFavs = [...favorites, placeId];
      }
      setFavorites(nextFavs);
      localStorage.setItem('nongkaem888_local_favs', JSON.stringify(nextFavs));
    }
  };

  // Auth
  const handleAuthSuccess = (member: Member) => {
    setCurrentUser(member);
    setFavorites(member.favorites || []);
  };

  const handleLogout = () => {
    ApiService.setCurrentUser(null);
    setCurrentUser(null);
    setFavorites([]);
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-slate-100 antialiased selection:bg-pink-500 selection:text-white relative overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.bgHex }}
    >
      {/* Ambient Atmospheric Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full ${theme.glows.c1} blur-[120px] transition-all duration-700`} />
        <div className={`absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full ${theme.glows.c2} blur-[130px] transition-all duration-700`} />
        <div className={`absolute top-2/3 left-1/3 w-[600px] h-[600px] rounded-full ${theme.glows.c3} blur-[140px] transition-all duration-700`} />
        <div className={`absolute -bottom-32 right-10 w-[500px] h-[500px] rounded-full ${theme.glows.c4} blur-[120px] transition-all duration-700`} />
      </div>

      {/* Top Navbar */}
      <div className="relative z-10">
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
          placesCount={places.length}
        />
      </div>

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {currentTab === 'home' && (
          <HomePage
            places={places}
            onTriggerRandom={handleTriggerRandom}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectPlace={(p) => {
              setSelectedPlace(p);
              setIsResultOpen(true);
            }}
            onNavigateDirectory={() => setCurrentTab('directory')}
          />
        )}

        {currentTab === 'directory' && (
          <DirectoryPage
            places={places}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectPlace={(p) => {
              setSelectedPlace(p);
              setIsResultOpen(true);
            }}
          />
        )}

        {currentTab === 'stats' && (
          <StatsPage
            stats={stats}
            places={places}
            onSelectPlace={(p) => {
              setSelectedPlace(p);
              setIsResultOpen(true);
            }}
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'timeline' && <TimelinePage />}

        {currentTab === 'admin' && (
          <AdminPage
            currentUser={currentUser}
            places={places}
            onRefreshPlaces={refreshPlaces}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === 'member' && (
          <MemberPage
            currentUser={currentUser}
            places={places}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectPlace={(p) => {
              setSelectedPlace(p);
              setIsResultOpen(true);
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer
        className="border-t mt-auto py-8 relative z-10 transition-colors duration-500"
        style={{
          backgroundColor: `${theme.footerHex}ee`,
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span
                className={`font-extrabold text-sm bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}
              >
                NongKaem888 – “วันนี้ไปไหนดี?”
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badgeClass}`}>
                ชลบุรี
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setCurrentTab('home')}
                className="hover:text-white transition-colors"
              >
                สุ่มที่เที่ยว
              </button>
              <button
                onClick={() => setCurrentTab('directory')}
                className="hover:text-white transition-colors"
              >
                สถานที่ทั้งหมด ({places.length})
              </button>
              <button
                onClick={() => setCurrentTab('stats')}
                className="hover:text-white transition-colors"
              >
                แดชบอร์ดสถิติ
              </button>
              <button
                onClick={() => setCurrentTab('timeline')}
                className="hover:text-white transition-colors"
              >
                Project Timeline
              </button>
              <button
                onClick={() => setIsDeployGuideOpen(true)}
                className="text-pink-400 font-semibold hover:underline"
              >
                คู่มือ GitHub & Vercel
              </button>
            </div>

            <p className="text-slate-400 text-center sm:text-right">
              ระบบสุ่มสถานที่จริงในจังหวัดชลบุรี • ธีม: {theme.name}
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Theme Button */}
      <FloatingThemeButton />

      {/* MODALS */}
      {/* 1. Theme Picker Modal */}
      <ThemeModal />

      {/* 2. Lucky Draw Slot Machine Animation Modal */}
      <LuckyDrawModal
        isOpen={isLuckyDrawOpen}
        sequence={luckySequence}
        winner={luckyWinner}
        onFinished={handleLuckyDrawFinished}
      />

      {/* 3. Winning Result Popup */}
      <ResultModal
        isOpen={isResultOpen}
        place={selectedPlace}
        onClose={() => setIsResultOpen(false)}
        onReroll={() => {
          setIsResultOpen(false);
          handleTriggerRandom(currentFilterUsed, currentDistrictUsed);
        }}
        isFavorite={selectedPlace ? favorites.includes(selectedPlace.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 4. Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* 5. Deployment Guide Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}
