import React, { useState, useEffect } from 'react';
import { Place } from '../types';
import { getPlaceGallery } from '../data/places';
import {
  X,
  MapPin,
  Flame,
  Star,
  Clock,
  Coins,
  Users,
  ExternalLink,
  Heart,
  Dice5,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  place: Place | null;
  onClose: () => void;
  onReroll: () => void;
  isFavorite: boolean;
  onToggleFavorite: (placeId: string) => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  place,
  onClose,
  onReroll,
  isFavorite,
  onToggleFavorite
}) => {
  const [copied, setCopied] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Reset active photo when place changes
  useEffect(() => {
    setActivePhotoIdx(0);
  }, [place?.id]);

  if (!isOpen || !place) return null;

  const photos = getPlaceGallery(place);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleShare = () => {
    const shareText = `วันนี้ไปที่นี่กัน! 🎉 ${place.name} (${place.district}, ชลบุรี) แนะนำโดย NongKaem888: ${place.googleMapsUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="result-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="result-modal-container"
        className="relative w-full max-w-xl bg-[#0d0f28] text-slate-100 rounded-t-3xl sm:rounded-3xl shadow-[0_0_60px_-10px_rgba(217,70,239,0.35)] overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300 border border-purple-500/30"
      >
        {/* Close Button */}
        <button
          id="btn-close-result"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-slate-950/70 text-slate-200 flex items-center justify-center backdrop-blur-md hover:bg-slate-950 hover:text-white border border-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overscroll-contain">
          {/* Header Banner - Dark Purple to Vibrant Pink */}
          <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 px-6 py-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎉</span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                วันนี้ไปที่นี่กัน!
              </h2>
            </div>
            <p className="text-xs text-purple-200 mt-0.5 font-light">
              ผลการสุ่มพร้อมรูปถ่าย 3-4 มุมมอง และข้อมูลการเดินทางครบครัน
            </p>
          </div>

          {/* Place Multi-Photo Gallery Showcase */}
          <div className="relative bg-slate-950">
            {/* Main Active Image Container */}
            <div className="relative aspect-16/10 bg-slate-900 overflow-hidden group">
              <img
                src={photos[activePhotoIdx] || place.image}
                alt={`${place.name} - รูปที่ ${activePhotoIdx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f28] via-transparent to-black/30 pointer-events-none" />

              {/* Prev / Next Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 text-white flex items-center justify-center backdrop-blur-xs hover:bg-pink-600 border border-white/20 transition-all active:scale-90"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 text-white flex items-center justify-center backdrop-blur-xs hover:bg-pink-600 border border-white/20 transition-all active:scale-90"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Top Badges on Image */}
              <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2 pointer-events-none">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-950/80 text-white text-xs font-semibold backdrop-blur-xs border border-purple-500/40">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  {place.district}, {place.province}
                </span>
                {place.popular && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold shadow-md">
                    <Flame className="w-3.5 h-3.5" />
                    สถานที่ยอดนิยม
                  </span>
                )}
              </div>

              {/* Photo Index Counter & Score */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 text-pink-300 text-xs font-bold backdrop-blur-xs border border-purple-500/40 shadow-md">
                  <Camera className="w-3.5 h-3.5 text-pink-400" />
                  <span>รูปที่ {activePhotoIdx + 1} จาก {photos.length} รูป</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{place.popularityScore}/100</span>
                </div>
              </div>
            </div>

            {/* 3-4 Clickable Photo Thumbnails Strip */}
            {photos.length > 1 && (
              <div className="p-3 bg-[#090b1c] border-b border-purple-500/20">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[11px] font-medium text-purple-300/80 flex items-center gap-1">
                    <Camera className="w-3 h-3 text-pink-400" />
                    เลือกดูมุมมองสถานที่ ({photos.length} รูป):
                  </span>
                  <span className="text-[10px] text-slate-400">คลิกที่รูปเพื่อเปลี่ยน</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {photos.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative aspect-16/10 rounded-xl overflow-hidden border-2 transition-all duration-200 group ${
                        activePhotoIdx === idx
                          ? 'border-pink-500 ring-2 ring-pink-500/50 scale-102 shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                          : 'border-purple-900/60 opacity-65 hover:opacity-100 hover:border-purple-400'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`มุมมอง ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent" />
                      <span className="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.2 bg-black/70 text-white rounded">
                        #{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Place Information Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Title & Categories */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {place.category.map((cat, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/80 text-pink-300 border border-purple-500/40"
                  >
                    ✨ {cat}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight leading-snug">
                {place.name}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {place.description}
            </p>

            {/* Quick Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#141638] border border-purple-500/25 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-900/50 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <Clock className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <span className="text-purple-300/80 block text-[11px]">เวลาเปิด-ปิด</span>
                  <span className="font-semibold text-white">{place.openingHours}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-900/50 flex items-center justify-center shrink-0 border border-pink-500/30">
                  <Coins className="w-4 h-4 text-pink-300" />
                </div>
                <div>
                  <span className="text-pink-300/80 block text-[11px]">ระดับราคา / ค่าเข้า</span>
                  <span className="font-semibold text-white">{place.priceLevel}</span>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 flex items-center gap-2.5 pt-2 border-t border-purple-900/40">
                <div className="w-8 h-8 rounded-xl bg-indigo-900/50 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <Users className="w-4 h-4 text-indigo-300" />
                </div>
                <div>
                  <span className="text-indigo-300/80 block text-[11px]">เหมาะสำหรับ</span>
                  <span className="font-semibold text-white">
                    {place.suitableFor.join(' • ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {place.tags && place.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {place.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-purple-300/80 bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-800/40"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 sm:p-5 bg-[#090b1c] border-t border-purple-900/40 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Google Maps Button */}
          <a
            id="btn-open-google-maps"
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102"
          >
            <MapPin className="w-4 h-4" />
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Favorite Toggle Button */}
          <button
            id="btn-toggle-favorite-result"
            onClick={() => onToggleFavorite(place.id)}
            className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
              isFavorite
                ? 'bg-pink-950/80 border-pink-500 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                : 'bg-[#141638] border-purple-500/40 text-slate-300 hover:bg-[#1b1e4a] hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-slate-400'}`} />
            <span>{isFavorite ? 'บันทึกแล้ว' : 'บันทึก'}</span>
          </button>

          {/* Re-roll Button */}
          <button
            id="btn-reroll-result"
            onClick={onReroll}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-transform active:scale-95"
          >
            <Dice5 className="w-4 h-4" />
            <span>สุ่มใหม่</span>
          </button>

          {/* Share Button */}
          <button
            id="btn-share-result"
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#141638] hover:bg-[#1e214d] text-slate-200 font-medium text-xs sm:text-sm border border-purple-500/30 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-bold">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-purple-300" />
                <span>แชร์</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
