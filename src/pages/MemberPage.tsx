import React from 'react';
import { Member, Place } from '../types';
import { PlaceCard } from '../components/PlaceCard';
import { Heart, History, User, MapPin, Calendar, LogOut, Compass } from 'lucide-react';

interface MemberPageProps {
  currentUser: Member | null;
  places: Place[];
  favorites: string[];
  onToggleFavorite: (placeId: string) => void;
  onSelectPlace: (place: Place) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const MemberPage: React.FC<MemberPageProps> = ({
  currentUser,
  places,
  favorites,
  onToggleFavorite,
  onSelectPlace,
  onOpenAuth,
  onLogout
}) => {
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">พื้นที่สมาชิก NongKaem888</h2>
        <p className="text-xs text-slate-500">
          เข้าสู่ระบบเพื่อบันทึกสถานที่โปรด ดูประวัติการสุ่ม และจัดการข้อมูลส่วนตัว
        </p>
        <button
          onClick={onOpenAuth}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-sm shadow-md hover:from-amber-600 hover:to-rose-600 transition-all"
        >
          เข้าสู่ระบบ หรือ สมัครสมาชิก
        </button>
      </div>
    );
  }

  // Favorite places objects
  const favoritePlaces = places.filter((p) => favorites.includes(p.id));

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md p-1 border border-white/30 shrink-0">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-rose-600 text-2xl font-black shadow-inner">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {currentUser.displayName}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/30 uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 mt-0.5">
                @{currentUser.username} • {currentUser.email}
              </p>
              <p className="text-[11px] text-white/80 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>สมาชิกตั้งแต่ {new Date(currentUser.createdAt).toLocaleDateString('th-TH')}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs transition-colors self-start sm:self-auto border border-white/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* FAVORITES SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              สถานที่โปรดของฉัน ({favoritePlaces.length})
            </h2>
          </div>
        </div>

        {favoritePlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoritePlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onSelectPlace={onSelectPlace}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
            <div className="text-3xl">🏖️</div>
            <h4 className="font-bold text-slate-800 text-sm">ยังไม่มีสถานที่โปรด</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              กดปุ่มหัวใจ ❤️ บนสถานที่ที่คุณชอบในหน้าสุ่มหรือหน้าสำรวจ เพื่อบันทึกไว้ดูภายหลัง
            </p>
          </div>
        )}
      </section>

      {/* DRAW HISTORY SECTION */}
      {currentUser.history && currentUser.history.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              ประวัติการสุ่มล่าสุด
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {currentUser.history.slice(0, 10).map((h, i) => {
              const matchedPlace = places.find((p) => p.id === h.placeId);
              return (
                <div
                  key={i}
                  onClick={() => matchedPlace && onSelectPlace(matchedPlace)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎲</span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {h.placeName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {new Date(h.rolledAt).toLocaleString('th-TH')}
                        {h.filterUsed && ` • ตัวกรอง: ${h.filterUsed}`}
                      </p>
                    </div>
                  </div>

                  {matchedPlace && (
                    <span className="text-xs text-amber-600 font-semibold hover:underline">
                      ดูข้อมูล
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
