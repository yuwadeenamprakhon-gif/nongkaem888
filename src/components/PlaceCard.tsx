import React from 'react';
import { Place } from '../types';
import { MapPin, Star, Heart, Flame, ExternalLink, Clock } from 'lucide-react';

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
  return (
    <div
      id={`place-card-${place.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-0.5"
    >
      {/* Image Container */}
      <div
        className="relative aspect-16/10 bg-slate-100 overflow-hidden cursor-pointer"
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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* District & Popular Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-medium backdrop-blur-xs">
            <MapPin className="w-3 h-3 text-rose-400" />
            {place.district}
          </span>

          {place.popular && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-xs">
              <Flame className="w-3 h-3" />
              ดัง
            </span>
          )}
        </div>

        {/* Favorite Button on Image */}
        <button
          id={`btn-fav-${place.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(place.id);
          }}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-transform active:scale-90 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/85 text-slate-700 hover:bg-white'
          }`}
          aria-label="Favorite"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Popularity Score */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300">
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
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Place Name */}
          <h4
            onClick={() => onSelectPlace(place)}
            className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors cursor-pointer"
          >
            {place.name}
          </h4>

          {/* Description */}
          <p className="text-xs text-slate-700 line-clamp-2 mt-1.5 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{place.openingHours}</span>
          </span>

          <div className="flex items-center gap-2">
            <a
              href={place.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="เปิด Google Maps"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => onSelectPlace(place)}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              รายละเอียด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
