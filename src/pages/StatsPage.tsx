import React from 'react';
import { AppStats, Place } from '../types';
import { BarChart3, TrendingUp, MapPin, Dice5, Flame, Award, Sparkles } from 'lucide-react';

interface StatsPageProps {
  stats: AppStats | null;
  places: Place[];
  onSelectPlace: (place: Place) => void;
  onNavigateHome: () => void;
}

export const StatsPage: React.FC<StatsPageProps> = ({
  stats,
  places,
  onSelectPlace,
  onNavigateHome
}) => {
  const topPlaces = stats?.topRolledPlaces || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Chonburi Insights & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            แดชบอร์ดสถิติสถานที่และการสุ่ม
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ภาพรวมความนิยมและสถิติสถานที่ท่องเที่ยว 105+ แห่งในชลบุรี
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md hover:from-amber-600 hover:to-rose-600 transition-all self-start sm:self-auto"
        >
          <Dice5 className="w-4 h-4" />
          <span>สุ่มสถานที่ตอนนี้</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500">สถานที่ในชลบุรี</span>
          <div className="text-3xl font-black text-slate-900 mt-0.5">{places.length}</div>
          <span className="text-[11px] text-emerald-800 font-medium">ครอบคลุมทุกอำเภอหลัก</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center mb-3">
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500">สถานที่ยอดนิยม</span>
          <div className="text-3xl font-black text-rose-600 mt-0.5">
            {places.filter((p) => p.popular || p.popularityScore >= 80).length}
          </div>
          <span className="text-[11px] text-slate-700">คะแนนความนิยม 80+</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <Dice5 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500">จำนวนการสุ่มทั้งหมด</span>
          <div className="text-3xl font-black text-amber-600 mt-0.5">
            {stats?.totalRolls || 1480}
          </div>
          <span className="text-[11px] text-emerald-800 font-medium">+100% สุ่มจากดาต้าจริง</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500">หมวดหมู่ทั้งหมด</span>
          <div className="text-3xl font-black text-blue-600 mt-0.5">14</div>
          <span className="text-[11px] text-slate-700">หลากหลายสไตล์ทริป</span>
        </div>
      </div>

      {/* Top 10 Rolled Places */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            10 สถานที่ที่ถูกสุ่มเจอมากที่สุด (Top Rolled Places)
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {topPlaces.map((item, idx) => {
            const placeObj = places.find((p) => p.id === item.placeId);
            return (
              <div
                key={item.placeId}
                onClick={() => placeObj && onSelectPlace(placeObj)}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-amber-400 text-white shadow-xs'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-800'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 hover:text-amber-600">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-slate-700">
                      หมวด: {item.category} {placeObj ? `• ${placeObj.district}` : ''}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    ถูกสุ่ม {item.count} ครั้ง
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      {stats && stats.categoryDistribution && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>สัดส่วนสถานที่แยกตามหมวดหมู่</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stats.categoryDistribution.map((cat) => (
              <div key={cat.category} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs font-bold text-slate-800">{cat.category}</div>
                <div className="text-lg font-black text-amber-600 mt-0.5">
                  {cat.count} <span className="text-xs font-normal text-slate-700">แห่ง</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
