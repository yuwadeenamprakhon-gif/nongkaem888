import React from 'react';
import { Place } from '../types';
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
  Check
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
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !place) return null;

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="result-modal-container"
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300 border border-slate-200"
      >
        {/* Close Button */}
        <button
          id="btn-close-result"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 text-white flex items-center justify-center backdrop-blur-xs hover:bg-slate-900/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overscroll-contain">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 px-6 py-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎉</span>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                วันนี้ไปที่นี่กัน!
              </h2>
            </div>
            <p className="text-xs text-amber-100 mt-0.5">
              ผลการสุ่มพร้อมข้อมูลการเดินทางครบครันสำหรับคุณ
            </p>
          </div>

          {/* Place Image */}
          <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
            <img
              src={place.image}
              alt={place.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Image fallback
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-xs border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {place.district}, {place.province}
              </span>
              {place.popular && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-md">
                  <Flame className="w-3.5 h-3.5" />
                  สถานที่ยอดนิยม
                </span>
              )}
            </div>

            {/* Popularity score badge */}
            <div className="absolute bottom-3 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/90 text-white text-xs font-bold backdrop-blur-xs shadow-md">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span>Popularity {place.popularityScore}/100</span>
            </div>
          </div>

          {/* Place Information Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Title & Categories */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {place.category.map((cat, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    🏷️ {cat}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {place.name}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {place.description}
            </p>

            {/* Quick Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-slate-700 block text-[11px]">เวลาเปิด-ปิด</span>
                  <span className="font-semibold text-slate-800">{place.openingHours}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-slate-700 block text-[11px]">ระดับราคา / ค่าเข้า</span>
                  <span className="font-semibold text-slate-800">{place.priceLevel}</span>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 flex items-center gap-2.5 text-slate-700 pt-1 border-t border-slate-200">
                <Users className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="text-slate-700 block text-[11px]">เหมาะสำหรับ</span>
                  <span className="font-semibold text-slate-800">
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
                    className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Google Maps Button */}
          <a
            id="btn-open-google-maps"
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Favorite Toggle Button */}
          <button
            id="btn-toggle-favorite-result"
            onClick={() => onToggleFavorite(place.id)}
            className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm border transition-all ${
              isFavorite
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
            <span>{isFavorite ? 'บันทึกแล้ว' : 'บันทึก'}</span>
          </button>

          {/* Re-roll Button */}
          <button
            id="btn-reroll-result"
            onClick={onReroll}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            <Dice5 className="w-4 h-4" />
            <span>สุ่มใหม่</span>
          </button>

          {/* Share or Close */}
          <button
            id="btn-share-result"
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>แชร์</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
