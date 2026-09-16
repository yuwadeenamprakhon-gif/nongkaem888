import React, { useState } from 'react';
import { Place, FilterType } from '../types';
import { QUICK_FILTERS, CHONBURI_DISTRICTS } from '../data/places';
import { RandomService } from '../services/randomService';
import { PlaceCard } from '../components/PlaceCard';
import {
  Dice5,
  Sparkles,
  MapPin,
  Flame,
  ChevronRight,
  Filter,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  places: Place[];
  onTriggerRandom: (filter: FilterType, district: string) => void;
  favorites: string[];
  onToggleFavorite: (placeId: string) => void;
  onSelectPlace: (place: Place) => void;
  onNavigateDirectory: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  places,
  onTriggerRandom,
  favorites,
  onToggleFavorite,
  onSelectPlace,
  onNavigateDirectory
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ทั้งหมด');

  // Calculate candidates for currently active filters
  const eligiblePlaces = RandomService.filterPlaces(places, {
    filterType: selectedFilter,
    district: selectedDistrict
  });

  const activeFilterMeta = QUICK_FILTERS.find((f) => f.id === selectedFilter) || QUICK_FILTERS[0];

  // Top popular highlights to showcase
  const popularHighlights = places
    .filter((p) => p.popular && p.isActive)
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 6);

  const handleRandomClick = () => {
    onTriggerRandom(selectedFilter, selectedDistrict);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-8 sm:pb-12 rounded-3xl bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-transparent border border-amber-200/60 p-4 sm:p-8 text-center shadow-xs">
        {/* Subtle decorative circles */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-rose-400/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 shadow-xs border border-amber-200 text-xs font-semibold text-amber-800">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span>NongKaem888 • ฐานข้อมูล 105+ สถานที่จริงในชลบุรี</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            “วันนี้ไปไหนดี?”
            <span className="block text-2xl sm:text-4xl mt-1 bg-gradient-to-r from-amber-600 via-rose-600 to-orange-500 bg-clip-text text-transparent">
              สุ่มที่เที่ยวชลบุรี ปลดล็อกทริปที่ใช่ทันที
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            หมดปัญหาไม่รู้จะไปไหน! สุ่มสถานที่จริงครบทุกสไตล์ ทั้งทะเล เกาะ คาเฟ่ ตลาด
            ห้าง สวนน้ำ จุดถ่ายรูป และที่เด็ดที่ไม่ควรพลาด
          </p>

          {/* District Selector & Filter Details Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {/* District Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="font-semibold text-slate-700">พื้นที่:</span>
              <select
                id="select-district-filter"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent font-bold text-amber-700 focus:outline-hidden cursor-pointer"
              >
                {CHONBURI_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Candidate count indicator */}
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs sm:text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                พร้อมสุ่ม <strong className="text-slate-900">{eligiblePlaces.length}</strong> แห่ง
              </span>
            </div>
          </div>

          {/* GIANT RANDOM BUTTON (Mobile-first, prominent, tactile) */}
          <div className="pt-4 sm:pt-6">
            <button
              id="btn-main-random"
              onClick={handleRandomClick}
              className="group relative w-full sm:w-auto min-w-[280px] sm:min-w-[340px] px-8 py-5 sm:py-6 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 text-white font-black text-xl sm:text-2xl shadow-xl shadow-rose-500/25 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-98 transition-all duration-200 border border-white/30"
            >
              <div className="flex items-center justify-center gap-3">
                <Dice5 className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500 shrink-0" />
                <span className="tracking-tight">สุ่มที่เที่ยวเลย!</span>
                <Sparkles className="w-6 h-6 animate-bounce shrink-0" />
              </div>

              <div className="text-[11px] sm:text-xs font-medium text-amber-100 mt-1 opacity-90">
                {activeFilterMeta.label} • {selectedDistrict === 'ทั้งหมด' ? 'ทุกพื้นที่ในชลบุรี' : selectedDistrict}
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY FILTERS (Card Pills) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              เลือกหมวดหมู่ที่ต้องการสุ่ม
            </h2>
          </div>
          <span className="text-xs text-slate-500">แตะเพื่อเปลี่ยนเงื่อนไขสุ่ม</span>
        </div>

        {/* Scrollable Horizontal / Grid Filter Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {QUICK_FILTERS.map((f) => {
            const isSelected = selectedFilter === f.id;
            return (
              <button
                key={f.id}
                id={`filter-chip-${f.id}`}
                onClick={() => setSelectedFilter(f.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500 to-rose-500 text-white border-transparent shadow-md scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{f.emoji}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  )}
                </div>
                <div className="mt-2">
                  <span className={`block font-bold text-xs sm:text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {f.label}
                  </span>
                  <span className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-600'}`}>
                    {f.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* POPULAR PLACES HIGHLIGHTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              สถานที่ยอดนิยมในชลบุรี (คะแนนสูงสุด)
            </h2>
          </div>
          <button
            onClick={onNavigateDirectory}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            <span>ดูทั้งหมด ({places.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularHighlights.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isFavorite={favorites.includes(place.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectPlace={onSelectPlace}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
