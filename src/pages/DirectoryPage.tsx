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
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Chonburi Travel Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            สำรวจสถานที่ท่องเที่ยวทั้งหมด
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            รวม 105+ พิกัดยอดนิยมในชลบุรี พัทยา บางแสน สัตหีบ เกาะล้าน และพื้นที่ใกล้เคียง
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
          พบ <strong className="text-amber-600">{filteredPlaces.length}</strong> จาก {places.length} แห่ง
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อสถานที่, อำเภอ, ชายหาด, หรือของกิน..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* District */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="text-slate-500 font-medium">อำเภอ:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden w-full cursor-pointer"
            >
              {CHONBURI_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-slate-500 font-medium">หมวด:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden w-full cursor-pointer"
            >
              <option value="ทั้งหมด">หมวดหมู่ทั้งหมด</option>
              {CATEGORIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <ArrowUpDown className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-slate-500 font-medium">เรียงตาม:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden w-full cursor-pointer"
            >
              <option value="popularity">คะแนนความนิยมสูงสุด</option>
              <option value="name">ชื่อสถานที่ (ก-ฮ / A-Z)</option>
              <option value="newest">อัปเดตล่าสุด</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips with Clear Button */}
        {(selectedDistrict !== 'ทั้งหมด' || selectedCategory !== 'ทั้งหมด' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">ตัวกรองที่เลือก:</span>
            {selectedDistrict !== 'ทั้งหมด' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                {selectedDistrict}
                <button onClick={() => setSelectedDistrict('ทั้งหมด')}>×</button>
              </span>
            )}
            {selectedCategory !== 'ทั้งหมด' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('ทั้งหมด')}>×</button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')}>×</button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-600 hover:underline font-semibold ml-auto"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </div>

      {/* Places Grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-lg font-bold text-slate-800">ไม่พบสถานที่ที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            ลองปรับคำค้นหา หรือเลือกพื้นที่และหมวดหมู่อื่นดูนะ
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xs hover:bg-amber-600"
          >
            ล้างตัวกรองและแสดงทั้งหมด
          </button>
        </div>
      )}
    </div>
  );
};
