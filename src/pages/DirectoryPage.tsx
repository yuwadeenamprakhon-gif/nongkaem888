import React, { useState, useMemo } from 'react';
import { Place } from '../types';
import { PlaceCard } from '../components/PlaceCard';
import { Search, MapPin, Filter, ArrowUpDown, Compass, X } from 'lucide-react';
import { CHONBURI_DISTRICTS, CATEGORIES_LIST } from '../data/places';

interface DirectoryPageProps {
  places: Place[];
  favorites: string[];
  onToggleFavorite: (placeId: string) => void;
  onSelectPlace: (place: Place) => void;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  places,
  favorites,
  onToggleFavorite,
  onSelectPlace
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ทั้งหมด');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'newest'>('popularity');

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = place.name.toLowerCase().includes(q);
        const matchDistrict = place.district.toLowerCase().includes(q);
        const matchDesc = place.description.toLowerCase().includes(q);
        const matchTags = place.tags.some((t) => t.toLowerCase().includes(q));
        const matchCat = place.category.some((c) => c.toLowerCase().includes(q));
        if (!matchName && !matchDistrict && !matchDesc && !matchTags && !matchCat) {
          return false;
        }
      }

      // District
      if (selectedDistrict !== 'ทั้งหมด') {
        if (!place.district.includes(selectedDistrict)) return false;
      }

      // Category
      if (selectedCategory !== 'ทั้งหมด') {
        if (!place.category.includes(selectedCategory)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popularity') {
        return b.popularityScore - a.popularityScore;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'th');
      }
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [places, searchQuery, selectedDistrict, selectedCategory, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('ทั้งหมด');
    setSelectedCategory('ทั้งหมด');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Chonburi Travel Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            สำรวจสถานที่ท่องเที่ยวทั้งหมด
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            รวม 105+ พิกัดยอดนิยมในชลบุรี พัทยา บางแสน สัตหีบ เกาะล้าน (พร้อมรูปจริง 3-4 รูปต่อสถานที่)
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-pink-300 self-start sm:self-auto">
          พบ <strong className="text-pink-400 font-bold">{filteredPlaces.length}</strong> จาก {places.length} แห่ง
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#0e102b]/90 p-4 sm:p-5 rounded-2xl border border-purple-500/20 shadow-lg space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อสถานที่, อำเภอ, ชายหาด, หรือของกิน..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-purple-500/30 bg-[#131538] text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* District */}
          <div className="flex items-center gap-2 bg-[#131538] px-3 py-2 rounded-xl border border-purple-500/30 text-xs text-slate-200">
            <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="text-slate-400 font-medium">อำเภอ:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent font-bold text-pink-300 focus:outline-hidden w-full cursor-pointer"
            >
              {CHONBURI_DISTRICTS.map((d) => (
                <option key={d} value={d} className="bg-[#131538] text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 bg-[#131538] px-3 py-2 rounded-xl border border-purple-500/30 text-xs text-slate-200">
            <Filter className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-slate-400 font-medium">หมวด:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-bold text-pink-300 focus:outline-hidden w-full cursor-pointer"
            >
              <option value="ทั้งหมด" className="bg-[#131538] text-white">หมวดหมู่ทั้งหมด</option>
              {CATEGORIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-[#131538] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 bg-[#131538] px-3 py-2 rounded-xl border border-purple-500/30 text-xs text-slate-200">
            <ArrowUpDown className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-slate-400 font-medium">เรียงตาม:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-pink-300 focus:outline-hidden w-full cursor-pointer"
            >
              <option value="popularity" className="bg-[#131538] text-white">คะแนนความนิยมสูงสุด</option>
              <option value="name" className="bg-[#131538] text-white">ชื่อสถานที่ (ก-ฮ / A-Z)</option>
              <option value="newest" className="bg-[#131538] text-white">อัปเดตล่าสุด</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips with Clear Button */}
        {(selectedDistrict !== 'ทั้งหมด' || selectedCategory !== 'ทั้งหมด' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-900/40 text-xs">
            <span className="text-slate-400 font-medium">ตัวกรองที่เลือก:</span>
            {selectedDistrict !== 'ทั้งหมด' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950 text-pink-300 border border-purple-500/40 font-semibold">
                {selectedDistrict}
                <button onClick={() => setSelectedDistrict('ทั้งหมด')}>×</button>
              </span>
            )}
            {selectedCategory !== 'ทั้งหมด' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-950/80 text-pink-300 border border-pink-500/40 font-semibold">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('ทั้งหมด')}>×</button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/40 font-semibold">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')}>×</button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs text-pink-400 hover:text-pink-300 hover:underline font-semibold ml-auto"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </div>

      {/* Places Grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isFavorite={favorites.includes(place.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectPlace={onSelectPlace}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0e102b]/90 rounded-3xl border border-purple-500/20 p-8">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-lg font-bold text-white">ไม่พบสถานที่ที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            ลองปรับคำค้นหา หรือเลือกพื้นที่และหมวดหมู่อื่นดูนะ
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold shadow-md hover:from-purple-500 hover:to-pink-400"
          >
            ล้างตัวกรองและแสดงทั้งหมด
          </button>
        </div>
      )}
    </div>
  );
};
