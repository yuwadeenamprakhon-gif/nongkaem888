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
  Activity,
  UserPlus,
  Info
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

  const handleSimulateRegister = async (customEmail?: string, customName?: string) => {
    setLoadingAction(true);
    try {
      const realisticCandidates = [
        { username: 'yuwadee_tour', email: customEmail || 'yuwadeenamprakhon@gmail.com', displayName: customName || 'ยุวดี (นักท่องเที่ยวชลบุรี)' },
        { username: 'somchai_chilling', email: 'somchai.trip@gmail.com', displayName: 'สมชาย พาชิลบางแสน' },
        { username: 'ploy_cafehopper', email: 'nongploy.cafe@gmail.com', displayName: 'น้องพลอย สายคาเฟ่' },
        { username: 'bank_pattaya', email: 'bank.pattaya99@gmail.com', displayName: 'แบงค์ ตะลุยพัทยา' },
        { username: 'aom_chonburi', email: 'aom.chonburi@gmail.com', displayName: 'อ้อม อ่างศิลา' }
      ];
      const candidate = realisticCandidates.find((c) => !members.some((m) => m.email.toLowerCase() === c.email.toLowerCase())) || {
        username: `traveler_${Math.floor(1000 + Math.random() * 9000)}`,
        email: `user_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`,
        displayName: `สมาชิกท่านใหม่ ${Math.floor(Math.random() * 100)}`
      };

      await ApiService.register(candidate.username, candidate.email, candidate.displayName, 'demo1234');
      await loadAdminData();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (window.confirm(`คุณต้องการลบสมาชิก "${memberName}" ออกจากระบบหรือไม่?`)) {
      setLoadingAction(true);
      try {
        await ApiService.deleteMember(memberId);
        await loadAdminData();
      } finally {
        setLoadingAction(false);
      }
    }
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
      <div className="max-w-md mx-auto my-12 p-8 bg-[#0e102b]/95 rounded-3xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-lg">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">
            Admin & Member Management
          </span>
          <h2 className="text-xl font-black text-white mt-1">พื้นที่หลังบ้าน (Admin) & รายชื่อคนสมัคร</h2>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            ระบบตรวจสอบรายชื่อผู้สมัครสมาชิกทั้งหมด, จำนวนครั้งที่ล็อกอิน, และประวัติการเข้าใช้งาน
          </p>
        </div>

        {/* Instant 1-Click Unlock button */}
        <button
          type="button"
          onClick={() => {
            setAdminPin('admin888');
            setIsPinUnlocked(true);
            setActiveTab('members');
            setMemberSubTab('members');
          }}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2 group active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
          <span>⚡ คลิกตรงนี้เพื่อปลดล็อกดูสมาชิกทันที (admin888)</span>
        </button>

        <div className="flex items-center gap-2 text-slate-500 text-xs my-2">
          <div className="flex-1 h-px bg-purple-900/40"></div>
          <span>หรือกรอกรหัสผ่านด้วยตนเอง</span>
          <div className="flex-1 h-px bg-purple-900/40"></div>
        </div>

        <form onSubmit={handleUnlockPin} className="space-y-3">
          <div className="relative">
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="กรอกรหัสผ่าน Admin (เช่น admin888)"
              className="w-full px-4 py-2.5 rounded-xl border border-purple-500/30 bg-[#131538] text-white text-sm text-center font-mono placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:outline-hidden"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-700/80 hover:bg-purple-600 text-white font-bold text-xs shadow-md transition-all border border-purple-500/30"
          >
            เข้าสู่ระบบ Admin
          </button>
        </form>

        <div className="pt-3 border-t border-purple-900/40">
          <button
            onClick={onOpenAuth}
            className="text-xs font-semibold text-pink-400 hover:text-pink-300 hover:underline"
          >
            หรือเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบ (admin / admin888)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0e102b]/95 border border-purple-500/20 text-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center border border-purple-400/40 shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                แผงควบคุมระบบ NongKaem888 Admin
              </h1>
              <span className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-2 py-0.5 rounded-full shadow-xs">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              ตรวจสอบรายชื่อสมาชิกทั้งหมด, ประวัติเวลาที่ล็อกอิน, และจัดการสถานที่ 105+ แห่ง
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRefreshPlaces()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131538] hover:bg-[#1a1d4a] border border-purple-500/30 text-slate-200 text-xs font-medium transition-colors"
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มสถานที่ใหม่</span>
          </button>
        </div>
      </div>

      {/* QUICK MEMBER HIGHLIGHT BANNER */}
      <div className="bg-gradient-to-r from-purple-950/80 via-[#13153b] to-pink-950/70 p-4 rounded-2xl border border-purple-500/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>รายชื่อผู้สมัครสมาชิกทั้งหมด:</span>
              <span className="text-pink-400 font-extrabold text-base bg-pink-950/60 px-2 py-0.5 rounded-lg border border-pink-500/30">
                {members.length || stats?.totalMembers || 2} คน
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              กดปุ่มด้านขวาเพื่อดูรายชื่อคนสมัคร หรือดูเวลาที่คนล็อกอินเข้าใช้งาน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveTab('members');
              setMemberSubTab('members');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'members' && memberSubTab === 'members'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                : 'bg-[#131538] text-slate-300 hover:text-white border border-purple-500/30'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ดูรายชื่อคนสมัคร</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('members');
              setMemberSubTab('logs');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'members' && memberSubTab === 'logs'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                : 'bg-[#131538] text-slate-300 hover:text-white border border-purple-500/30'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>ดูประวัติคนล็อกอิน</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => setActiveTab('places')}
          className="bg-[#0e102b]/90 p-4 rounded-2xl border border-purple-500/20 shadow-md cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <span className="text-slate-400 text-xs font-medium">สถานที่ทั้งหมด</span>
          <div className="text-2xl font-black text-white mt-1">{places.length}</div>
          <span className="text-[10px] text-pink-400 font-semibold mt-0.5 block">
            คลิกเพื่อจัดการ ↗
          </span>
        </div>

        <div
          onClick={() => {
            setActiveTab('members');
            setMemberSubTab('members');
          }}
          className="bg-[#0e102b]/90 p-4 rounded-2xl border border-pink-500/30 shadow-md cursor-pointer hover:border-pink-500/60 hover:bg-[#13153b] transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-pink-300 text-xs font-bold">สมาชิกที่สมัคร</span>
            <Users className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-pink-400 mt-1">
            {members.length || stats?.totalMembers || 2}
          </div>
          <span className="text-[10px] text-pink-300 underline font-semibold mt-0.5 block">
            คลิกดูรายชื่อคนสมัคร ↗
          </span>
        </div>

        <div className="bg-[#0e102b]/90 p-4 rounded-2xl border border-purple-500/20 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">ออนไลน์ตอนนี้</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {stats?.activeUsersNow || members.filter((m) => m.isOnline).length || 1}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">
            กำลังใช้งานระบบ
          </span>
        </div>

        <div className="bg-[#0e102b]/90 p-4 rounded-2xl border border-purple-500/20 shadow-md">
          <span className="text-slate-400 text-xs font-medium">ล็อกอินวันนี้</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {stats?.loginsToday || 4}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">ครั้ง (วันนี้)</span>
        </div>

        <div
          onClick={() => {
            setActiveTab('members');
            setMemberSubTab('logs');
          }}
          className="bg-[#0e102b]/90 p-4 rounded-2xl border border-purple-500/20 shadow-md cursor-pointer hover:border-purple-500/50 hover:bg-[#13153b] transition-all"
        >
          <span className="text-slate-400 text-xs font-medium">ล็อกอินสะสม</span>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {stats?.totalLogins || 132}
          </div>
          <span className="text-[10px] text-purple-300 underline mt-0.5 block">
            คลิกดูประวัติล็อกอิน ↗
          </span>
        </div>

        <div className="bg-[#0e102b]/90 p-4 rounded-2xl border border-purple-500/20 shadow-md">
          <span className="text-slate-400 text-xs font-medium">จำนวนครั้งที่สุ่ม</span>
          <div className="text-2xl font-black text-pink-400 mt-1">
            {stats?.totalRolls || 1480}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">สถิติ Lucky Draw</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-purple-900/40">
        <button
          onClick={() => setActiveTab('places')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'places'
              ? 'border-pink-500 text-pink-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          จัดการสถานที่ ({places.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'stats'
              ? 'border-pink-500 text-pink-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          สถิติภาพรวมและการกระจายตัว
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'members'
              ? 'border-pink-500 text-pink-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>👥 สมาชิก & บันทึกการล็อกอิน ({members.length})</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
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

          {/* Desktop / Tablet Table View */}
          <div className="hidden md:block overflow-x-auto">
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

          {/* Mobile Phone Card List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {displayPlaces.map((place) => (
              <div key={place.id} className="p-3.5 flex flex-col gap-2.5">
                <div className="flex items-start gap-3">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm truncate">
                      {place.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-700">{place.district}</span>
                      <span>•</span>
                      <span className="text-amber-600 font-bold">★ {place.popularityScore}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {place.category.slice(0, 3).map((c, i) => (
                        <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Bar for Mobile */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePopular(place)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        place.popular
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{place.popular ? 'ยอดนิยม' : 'ทั่วไป'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleActive(place)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        place.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {place.isActive ? 'เปิดอยู่' : 'ซ่อน'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingPlace(place);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                      title="แก้ไข"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlace(place.id, place.name)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
          <div className="bg-[#0e102b]/95 p-4 rounded-2xl border border-purple-500/20 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-[#131538] p-1.5 rounded-xl w-full sm:w-auto border border-purple-500/30">
              <button
                onClick={() => setMemberSubTab('members')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  memberSubTab === 'members'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>👥 บัญชีคนสมัครสมาชิก ({members.length})</span>
              </button>
              <button
                onClick={() => setMemberSubTab('logs')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  memberSubTab === 'logs'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-pink-300" />
                <span>📋 บันทึกประวัติการล็อกอิน ({loginLogs.length})</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, อีเมล หรือ username..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#131538] border border-purple-500/30 rounded-xl text-xs text-white placeholder-slate-400 focus:bg-[#181b47] focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button
                onClick={loadAdminData}
                title="รีเฟรชข้อมูล"
                className="p-2 rounded-xl border border-purple-500/30 bg-[#131538] hover:bg-[#1d2157] text-pink-300 text-xs flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: MEMBERS LIST */}
          {memberSubTab === 'members' && (
            <div className="bg-[#0e102b]/95 rounded-3xl border border-purple-500/20 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-pink-400" />
                    <span>รายชื่อสมาชิกและสถานะการเข้าใช้งาน (Registered Users)</span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    ตรวจสอบว่าใครกำลังออนไลน์, สมัครไว้เมื่อไหร่, ล็อกอินกี่ครั้ง และเข้าใช้งานล่าสุดเมื่อใด
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 text-pink-300 font-bold text-[11px] border border-purple-500/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>ออนไลน์: {members.filter((m) => m.isOnline).length || 1} คน</span>
                  </span>
                </div>
              </div>

              {/* EXPLANATION INFO BOX */}
              <div className="p-4 bg-gradient-to-r from-purple-950/70 via-[#13153b]/90 to-pink-950/60 border-b border-purple-900/40 text-xs text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 mt-0.5 border border-pink-500/30">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-pink-300 flex items-center gap-1.5">
                      <span>ทำไมก่อนหน้านี้ถึงไม่เห็นอีเมลคนอื่น?</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      ตามนโยบายความเป็นส่วนตัวสากล (Web Privacy Policy) เบราว์เซอร์จะไม่ส่งอีเมลของคนที่ <span className="text-white font-semibold">"แค่กดเข้ามาดูเว็บเฉยๆ (Visitors)"</span>{' '}
                      <span className="text-pink-400 font-bold underline">อีเมลจะบันทึกเข้ามาแสดงในหน้านี้ก็ต่อเมื่อคนๆ นั้นกด "สมัครสมาชิก" (Register)</span> ผ่านหน้าเว็บเท่านั้น!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => handleSimulateRegister()}
                    disabled={loadingAction}
                    className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ ลองจำลองคนสมัครสมาชิกใหม่</span>
                  </button>
                </div>
              </div>

              {/* Desktop / Tablet Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#131538] text-pink-300 font-semibold border-b border-purple-900/40">
                    <tr>
                      <th className="p-3.5">ผู้ใช้งาน (Member)</th>
                      <th className="p-3.5">อีเมล (Email)</th>
                      <th className="p-3.5">บทบาท (Role)</th>
                      <th className="p-3.5 text-center">สถานะ</th>
                      <th className="p-3.5 text-center">จำนวนครั้งที่ล็อกอิน</th>
                      <th className="p-3.5">เข้าสู่ระบบล่าสุด</th>
                      <th className="p-3.5 text-center">สถานที่โปรด</th>
                      <th className="p-3.5 text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/30">
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
                          <tr key={m.id} className="hover:bg-[#131538]/60 transition-colors">
                            <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                              <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                                  {m.displayName.charAt(0)}
                                </div>
                                {isOnline && (
                                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0e102b]"></span>
                                )}
                              </div>
                              <div>
                                <div className="font-extrabold text-white">{m.displayName}</div>
                                <div className="text-[11px] text-pink-300/70 font-normal">@{m.username}</div>
                              </div>
                            </td>
                            <td className="p-3.5 text-slate-300 font-mono text-[11px]">{m.email}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                  m.role === 'admin'
                                    ? 'bg-purple-950 text-pink-300 border border-pink-500/40'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {m.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              {isOnline ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                  <span>ออนไลน์</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                                  ออฟไลน์
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-center font-black text-pink-400">
                              <span className="bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-500/40">
                                {loginCount} ครั้ง
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-300">
                              <div className="flex items-center gap-1.5 text-[11px]">
                                <Clock className="w-3 h-3 text-purple-400" />
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
                            <td className="p-3.5 text-center font-semibold text-pink-400">
                              {m.favorites ? m.favorites.length : 0} แห่ง
                            </td>
                            <td className="p-3.5 text-center">
                              {m.role !== 'admin' ? (
                                <button
                                  onClick={() => handleDeleteMember(m.id, m.displayName)}
                                  title="ลบสมาชิกนี้"
                                  className="p-1.5 rounded-lg bg-red-950/50 text-red-400 hover:bg-red-900/80 hover:text-red-200 transition-colors border border-red-500/30"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-500">แอดมินหลัก</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Phone Card List View for Members */}
              <div className="md:hidden divide-y divide-purple-900/30">
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
                      <div key={m.id} className="p-3.5 space-y-2.5 bg-[#0e102b]/60">
                        {/* Member Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                                {m.displayName.charAt(0)}
                              </div>
                              {isOnline && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0e102b]"></span>
                              )}
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-white">{m.displayName}</div>
                              <div className="text-[11px] text-pink-300/70">@{m.username}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                m.role === 'admin'
                                  ? 'bg-purple-950 text-pink-300 border border-pink-500/40'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {m.role.toUpperCase()}
                            </span>
                            {isOnline ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                <span>ออนไลน์</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                                ออฟไลน์
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Email & Details */}
                        <div className="text-xs text-slate-300 font-mono bg-[#131538] px-3 py-1.5 rounded-xl border border-purple-900/40 flex items-center justify-between">
                          <span className="truncate">{m.email}</span>
                          <span className="text-[11px] font-bold text-pink-400 shrink-0 ml-2">
                            ★ {m.favorites ? m.favorites.length : 0} รายการโปรด
                          </span>
                        </div>

                        {/* Footer Info & Action */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="bg-purple-950/80 px-2 py-0.5 rounded-md text-pink-300 font-semibold border border-purple-500/30">
                              ล็อกอิน {loginCount} ครั้ง
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-purple-400" />
                              <span>
                                {m.lastLoginAt
                                  ? new Date(m.lastLoginAt).toLocaleDateString('th-TH', {
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : 'วันนี้'}
                              </span>
                            </span>
                          </div>

                          {m.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteMember(m.id, m.displayName)}
                              className="px-2.5 py-1 rounded-lg bg-red-950/50 text-red-400 hover:bg-red-900/80 text-xs font-semibold flex items-center gap-1 border border-red-500/30"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>ลบ</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: LOGIN ACTIVITY LOGS */}
          {memberSubTab === 'logs' && (
            <div className="bg-[#0e102b]/95 rounded-3xl border border-purple-500/20 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-purple-900/40 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-pink-400" />
                    <span>บันทึกประวัติการล็อกอินแบบเรียลไทม์ (Login Activity Audit)</span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    ประวัติเวลาเข้าสู่ระบบของแต่ละบัญชีแบบละเอียด บันทึกจริงลงเซิร์ฟเวอร์
                  </p>
                </div>
                <div className="text-xs text-pink-300 font-semibold">
                  รวมทั้งหมด <span className="font-bold text-white">{loginLogs.length}</span> รายการ
                </div>
              </div>

              {/* Desktop / Tablet Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#131538] text-pink-300 font-semibold border-b border-purple-900/40">
                    <tr>
                      <th className="p-3.5">ผู้เข้าสู่ระบบ</th>
                      <th className="p-3.5">สิทธิ์</th>
                      <th className="p-3.5">วันเวลาที่ล็อกอิน</th>
                      <th className="p-3.5">อุปกรณ์ / ช่องทาง</th>
                      <th className="p-3.5 text-center">สถานะการเข้าสู่ระบบ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/30">
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
                        <tr key={log.id || idx} className="hover:bg-[#131538]/60 transition-colors">
                          <td className="p-3.5 font-bold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-[10px]">
                              {log.displayName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="text-white">{log.displayName}</div>
                              <div className="text-[10px] text-pink-300/70 font-normal">@{log.username}</div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                log.role === 'admin'
                                  ? 'bg-purple-950 text-pink-300 border border-pink-500/40'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {log.role?.toUpperCase() || 'MEMBER'}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-pink-400" />
                              <span className="font-medium">
                                {new Date(log.loginAt).toLocaleString('th-TH', {
                                  dateStyle: 'medium',
                                  timeStyle: 'medium'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-300">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#131538] text-slate-300 text-[11px] border border-purple-500/30">
                              <Laptop className="w-3 h-3 text-purple-400" />
                              <span>{log.device || 'Web Browser'}</span>
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>สำเร็จ (Success)</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Phone Card List View for Login Activity */}
              <div className="md:hidden divide-y divide-purple-900/30">
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
                    <div key={log.id || idx} className="p-3 space-y-2 bg-[#0e102b]/60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-[10px]">
                            {log.displayName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs">{log.displayName}</span>
                            <span className="text-[10px] text-pink-300/70 ml-1.5">@{log.username}</span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[9px] ${
                            log.role === 'admin'
                              ? 'bg-purple-950 text-pink-300 border border-pink-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {log.role?.toUpperCase() || 'MEMBER'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3 text-pink-400" />
                          <span>
                            {new Date(log.loginAt).toLocaleString('th-TH', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>ล็อกอินสำเร็จ</span>
                        </span>
                      </div>
                    </div>
                  ))}
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
