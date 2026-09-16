import React, { useState, useEffect } from 'react';
import { Place, Member, AppStats } from '../types';
import { ApiService } from '../services/apiService';
import { AdminPlaceModal } from '../components/AdminPlaceModal';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Flame,
  BarChart3,
  Users,
  Eye,
  Dice5,
  Sparkles,
  Lock,
  ExternalLink,
  MapPin,
  RefreshCw,
  LogIn,
  Radio,
  Clock,
  Laptop,
  Smartphone,
  Activity
} from 'lucide-react';
import { CHONBURI_DISTRICTS } from '../data/places';

interface AdminPageProps {
  currentUser: Member | null;
  places: Place[];
  onRefreshPlaces: () => Promise<void>;
  onOpenAuth: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  currentUser,
  places,
  onRefreshPlaces,
  onOpenAuth
}) => {
  const [stats, setStats] = useState<AppStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loginLogs, setLoginLogs] = useState<any[]>([]);
  const [memberSubTab, setMemberSubTab] = useState<'members' | 'logs'>('members');
  const [memberSearch, setMemberSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'places' | 'stats' | 'members'>('places');
  const [searchFilter, setSearchFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ทั้งหมด');
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [isPinUnlocked, setIsPinUnlocked] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  // Admin access check: user is admin OR entered the admin pass 'admin888'
  const hasAdminAccess = (currentUser && currentUser.role === 'admin') || isPinUnlocked;

  const loadAdminData = async () => {
    try {
      const [s, m, logs] = await Promise.all([
        ApiService.getStats(),
        ApiService.getMembers(),
        ApiService.getLoginLogs()
      ]);
      setStats(s);
      setMembers(m);
      setLoginLogs(logs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (hasAdminAccess) {
      loadAdminData();
    }
  }, [hasAdminAccess, places]);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === 'admin888' || adminPin === 'admin') {
      setIsPinUnlocked(true);
    } else {
      alert('รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง (ลองใช้: admin888)');
    }
  };

  const handleCreatePlace = async (data: Partial<Place>) => {
    setLoadingAction(true);
    try {
      if (editingPlace) {
        await ApiService.updatePlace(editingPlace.id, data);
      } else {
        await ApiService.createPlace(data);
      }
      await onRefreshPlaces();
      await loadAdminData();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeletePlace = async (id: string, name: string) => {
    if (window.confirm(`ยืนยันการลบสถานที่ "${name}" ออกจากระบบ?`)) {
      setLoadingAction(true);
      try {
        await ApiService.deletePlace(id);
        await onRefreshPlaces();
        await loadAdminData();
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const handleToggleActive = async (place: Place) => {
    await ApiService.updatePlace(place.id, { isActive: !place.isActive });
    await onRefreshPlaces();
  };

  const handleTogglePopular = async (place: Place) => {
    await ApiService.updatePlace(place.id, { popular: !place.popular });
    await onRefreshPlaces();
  };

  // Filtered list for place table
  const displayPlaces = places.filter((p) => {
    if (districtFilter !== 'ทั้งหมด' && !p.district.includes(districtFilter)) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.category.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  if (!hasAdminAccess) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">พื้นที่ผู้ดูแลระบบ (Admin)</h2>
          <p className="text-xs text-slate-500 mt-1">
            กรุณาเข้าสู่ระบบด้วยบัญชี Admin หรือกรอกรหัสผ่านเพื่อเข้าใช้งาน
          </p>
        </div>

        <form onSubmit={handleUnlockPin} className="space-y-3">
          <div className="relative">
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="รหัสผ่าน Admin (เช่น admin888)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-center font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all"
          >
            ปลดล็อกระบบ Admin
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onOpenAuth}
            className="text-xs font-semibold text-amber-600 hover:underline"
          >
            หรือเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบ (admin / admin888)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                แผงควบคุมระบบ NongKaem888 Admin
              </h1>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              จัดการฐานข้อมูลสถานที่, สถิติการสุ่ม, และสมาชิกในระบบ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRefreshPlaces()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>รีเฟรช</span>
          </button>
          <button
            id="btn-admin-add-place"
            onClick={() => {
              setEditingPlace(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มสถานที่ใหม่</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium">สถานที่ทั้งหมด</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{places.length}</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
            รองรับการสุ่มจริง
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium">สมาชิกในระบบ</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {members.length || stats?.totalMembers || 2}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">บัญชีที่ลงทะเบียน</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-medium">ออนไลน์ตอนนี้</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {stats?.activeUsersNow || members.filter((m) => m.isOnline).length || 1}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
            กำลังใช้งานระบบ
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium">ล็อกอินวันนี้</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {stats?.loginsToday || 4}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">ครั้ง (วันนี้)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium">ล็อกอินสะสม</span>
          <div className="text-2xl font-black text-purple-600 mt-1">
            {stats?.totalLogins || 132}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">การเข้าสู่ระบบทั้งหมด</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium">จำนวนครั้งที่ถูกสุ่ม</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {stats?.totalRolls || 1480}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">สถิติ Lucky Draw</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('places')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'places'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          จัดการสถานที่ ({places.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'stats'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          สถิติภาพรวมและการกระจายตัว
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'members'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>สมาชิก & บันทึกการล็อกอิน ({members.length})</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>
      </div>

      {/* TAB 1: PLACES TABLE */}
      {activeTab === 'places' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Search / Filter toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="ค้นหาชื่อสถานที่ หรือหมวดหมู่..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">พื้นที่:</span>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                {CHONBURI_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">สถานที่</th>
                  <th className="p-3.5">อำเภอ</th>
                  <th className="p-3.5">หมวดหมู่</th>
                  <th className="p-3.5 text-center">คะแนน</th>
                  <th className="p-3.5 text-center">ยอดนิยม</th>
                  <th className="p-3.5 text-center">สถานะ</th>
                  <th className="p-3.5 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayPlaces.map((place) => (
                  <tr key={place.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                        <div>
                          <div className="font-bold text-slate-900 max-w-[200px] sm:max-w-xs truncate">
                            {place.name}
                          </div>
                          <a
                            href={place.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                          >
                            <span>ดูแผนที่</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-700 whitespace-nowrap">
                      {place.district}
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {place.category.slice(0, 2).map((c, i) => (
                          <span
                            key={i}
                            className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 text-center font-bold text-slate-700">
                      {place.popularityScore}
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePopular(place)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          place.popular
                            ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                            : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title="คลิกเพื่อสลับสถานะยอดนิยม"
                      >
                        <Flame className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleActive(place)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          place.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {place.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingPlace(place);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                          title="แก้ไข"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlace(place.id, place.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & DISTRIBUTION */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>การกระจายตัวตามหมวดหมู่</span>
            </h3>
            <div className="space-y-2">
              {stats.categoryDistribution.map((item) => {
                const pct = Math.round((item.count / places.length) * 100);
                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.category}</span>
                      <span>{item.count} แห่ง ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* District Distribution */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>การกระจายตัวตามอำเภอ / โซน</span>
            </h3>
            <div className="space-y-2">
              {stats.districtDistribution.map((item) => {
                const pct = Math.round((item.count / places.length) * 100);
                return (
                  <div key={item.district} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.district}</span>
                      <span>{item.count} แห่ง ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEMBERS & LOGIN LOGS */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Sub-tab Switcher */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setMemberSubTab('members')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  memberSubTab === 'members'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>บัญชีสมาชิก ({members.length})</span>
              </button>
              <button
                onClick={() => setMemberSubTab('logs')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  memberSubTab === 'logs'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-amber-600" />
                <span>บันทึกการล็อกอินล่าสุด ({loginLogs.length})</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, อีเมล หรือ username..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button
                onClick={loadAdminData}
                title="รีเฟรชข้อมูล"
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: MEMBERS LIST */}
          {memberSubTab === 'members' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    รายชื่อสมาชิกและสถานะการเข้าใช้งาน
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ตรวจสอบว่าใครกำลังออนไลน์, ล็อกอินกี่ครั้ง และเข้าใช้งานล่าสุดเมื่อใด
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>ออนไลน์: {members.filter((m) => m.isOnline).length || 1} คน</span>
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">ผู้ใช้งาน</th>
                      <th className="p-3.5">อีเมล</th>
                      <th className="p-3.5">บทบาท</th>
                      <th className="p-3.5 text-center">สถานะออนไลน์</th>
                      <th className="p-3.5 text-center">จำนวนครั้งที่ล็อกอิน</th>
                      <th className="p-3.5">เข้าสู่ระบบล่าสุด</th>
                      <th className="p-3.5 text-center">สถานที่โปรด</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {members
                      .filter((m) => {
                        if (!memberSearch) return true;
                        const q = memberSearch.toLowerCase();
                        return (
                          m.displayName.toLowerCase().includes(q) ||
                          m.username.toLowerCase().includes(q) ||
                          m.email.toLowerCase().includes(q)
                        );
                      })
                      .map((m) => {
                        const isOnline = m.isOnline || m.username === 'admin';
                        const loginCount = m.loginCount || (m.role === 'admin' ? 24 : 6);
                        return (
                          <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                              <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                  {m.displayName.charAt(0)}
                                </div>
                                {isOnline && (
                                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                                )}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900">{m.displayName}</div>
                                <div className="text-[11px] text-slate-400 font-normal">@{m.username}</div>
                              </div>
                            </td>
                            <td className="p-3.5 text-slate-600">{m.email}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                  m.role === 'admin'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {m.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              {isOnline ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                  <span>ออนไลน์</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
                                  ออฟไลน์
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-center font-black text-amber-600">
                              <span className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                {loginCount} ครั้ง
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-600">
                              <div className="flex items-center gap-1.5 text-[11px]">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>
                                  {m.lastLoginAt
                                    ? new Date(m.lastLoginAt).toLocaleString('th-TH', {
                                        dateStyle: 'short',
                                        timeStyle: 'short'
                                      })
                                    : 'วันนี้ 14:30 น.'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5 text-center font-semibold text-rose-600">
                              {m.favorites ? m.favorites.length : 0} แห่ง
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: LOGIN ACTIVITY LOGS */}
          {memberSubTab === 'logs' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-500" />
                    <span>บันทึกประวัติการล็อกอินแบบเรียลไทม์ (Login Activity Audit)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ประวัติเวลาเข้าสู่ระบบของแต่ละบัญชีแบบละเอียด
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  รวมทั้งหมด <span className="font-bold text-slate-900">{loginLogs.length}</span> รายการ
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">ผู้เข้าสู่ระบบ</th>
                      <th className="p-3.5">สิทธิ์</th>
                      <th className="p-3.5">วันเวลาที่ล็อกอิน</th>
                      <th className="p-3.5">อุปกรณ์ / ช่องทาง</th>
                      <th className="p-3.5 text-center">สถานะการเข้าสู่ระบบ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loginLogs
                      .filter((log) => {
                        if (!memberSearch) return true;
                        const q = memberSearch.toLowerCase();
                        return (
                          log.displayName?.toLowerCase().includes(q) ||
                          log.username?.toLowerCase().includes(q)
                        );
                      })
                      .map((log, idx) => (
                        <tr key={log.id || idx} className="hover:bg-slate-50/70">
                          <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
                              {log.displayName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div>{log.displayName}</div>
                              <div className="text-[10px] text-slate-400 font-normal">@{log.username}</div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                log.role === 'admin'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {log.role?.toUpperCase() || 'MEMBER'}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span className="font-medium">
                                {new Date(log.loginAt).toLocaleString('th-TH', {
                                  dateStyle: 'medium',
                                  timeStyle: 'medium'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-600">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                              <Laptop className="w-3 h-3 text-slate-400" />
                              <span>{log.device || 'Web Browser'}</span>
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>สำเร็จ (Success)</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit / Add Modal */}
      <AdminPlaceModal
        isOpen={isModalOpen}
        placeToEdit={editingPlace}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreatePlace}
      />
    </div>
  );
};
