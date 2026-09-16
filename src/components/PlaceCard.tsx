import React from 'react';
import { Place } from '../types';
import { MapPin, Star, Heart, Flame, ExternalLink, Clock, Camera } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectPlace: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isFavorite,
  onToggleFavorite,
  onSelectPlace
}) => {
  const photoCount = place.gallery?.length || 4;

  return (
    <div
      id={`place-card-${place.id}`}
      className="group bg-[#0f112a]/90 rounded-2xl border border-purple-500/20 overflow-hidden shadow-md hover:shadow-[0_0_25px_-5px_rgba(236,72,153,0.35)] hover:border-pink-500/60 transition-all duration-300 flex flex-col hover:-translate-y-1"
    >
      {/* Image Container */}
      <div
        className="relative aspect-16/10 bg-slate-900 overflow-hidden cursor-pointer"
        onClick={() => onSelectPlace(place)}
      >
        <img
          src={place.image}
          alt={place.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f112a] via-transparent to-black/30 pointer-events-none" />

        {/* District & Popular Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 text-white text-[11px] font-medium backdrop-blur-xs border border-purple-500/40">
            <MapPin className="w-3 h-3 text-pink-400" />
            {place.district}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Photo count indicator */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 text-pink-300 text-[10px] font-semibold backdrop-blur-xs border border-purple-500/30">
              <Camera className="w-2.5 h-2.5 text-pink-400" />
              <span>{photoCount} รูป</span>
            </span>

            {place.popular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold shadow-xs">
                <Flame className="w-3 h-3" />
                ดัง
              </span>
            )}
          </div>
        </div>

        {/* Favorite Button on Image */}
        <button
          id={`btn-fav-${place.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(place.id);
          }}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
            isFavorite
              ? 'bg-pink-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.6)]'
              : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-950 border border-white/10'
          }`}
          aria-label="Favorite"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Popularity Score */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{place.popularityScore}/100</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-2">
            {place.category.slice(0, 2).map((c, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/40"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Place Name */}
          <h4
            onClick={() => onSelectPlace(place)}
            className="font-bold text-base text-white line-clamp-1 group-hover:text-pink-400 transition-colors cursor-pointer"
          >
            {place.name}
          </h4>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 mt-3 border-t border-purple-900/30 flex items-center justify-between">
          <span className="text-[11px] text-purple-300/70 flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-400" />
            <span className="truncate max-w-[120px]">{place.openingHours}</span>
          </span>

          <div className="flex items-center gap-2">
            <a
              href={place.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-950/50 transition-colors"
              title="เปิด Google Maps"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => onSelectPlace(place)}
              className="text-xs font-semibold text-pink-300 hover:text-white bg-purple-900/40 hover:bg-pink-600 px-2.5 py-1.5 rounded-lg border border-purple-500/30 transition-all active:scale-95 whitespace-nowrap"
            >
              <span className="hidden sm:inline">ดู 3-4 รูป & ข้อมูล</span>
              <span className="inline sm:hidden">ดูรูปภาพ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
