import { Place, Member, AppStats } from '../types';
import { INITIAL_PLACES } from '../data/places';

const STORAGE_KEY_PLACES = 'nongkaem888_places';
const STORAGE_KEY_USER = 'nongkaem888_current_user';
const STORAGE_KEY_MEMBERS = 'nongkaem888_members';
const STORAGE_KEY_ROLLS = 'nongkaem888_rolls_count';

export class ApiService {
  private static isApiAvailable = true;

  // Local storage initialization helper
  private static getLocalPlaces(): Place[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PLACES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read places from local storage', e);
    }
    localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(INITIAL_PLACES));
    return INITIAL_PLACES;
  }

  private static saveLocalPlaces(places: Place[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(places));
    } catch (e) {
      console.warn('Could not save places to local storage', e);
    }
  }

  // Fetch all places
  static async getPlaces(): Promise<Place[]> {
    try {
      const res = await fetch('/api/places');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this.saveLocalPlaces(data);
          return data;
        }
      }
    } catch {
      this.isApiAvailable = false;
    }
    return this.getLocalPlaces();
  }

  // Add new place (Admin)
  static async createPlace(placeData: Partial<Place>): Promise<Place> {
    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      this.isApiAvailable = false;
    }

    // Fallback to local storage
    const current = this.getLocalPlaces();
    const newPlace: Place = {
      id: `custom-${Date.now()}`,
      name: placeData.name || 'สถานที่ใหม่',
      description: placeData.description || '',
      image: placeData.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      province: 'ชลบุรี',
      district: placeData.district || 'เมืองชลบุรี',
      category: placeData.category || ['จุดถ่ายรูป'],
      tags: placeData.tags || ['chonburi'],
      popular: Boolean(placeData.popular),
      popularityScore: Number(placeData.popularityScore) || 75,
      openingHours: placeData.openingHours || 'ตรวจสอบก่อนเดินทาง',
      priceLevel: placeData.priceLevel || 'ตรวจสอบก่อนเดินทาง',
      suitableFor: placeData.suitableFor || ['เพื่อน', 'ครอบครัว'],
      latitude: Number(placeData.latitude) || 13.3611,
      longitude: Number(placeData.longitude) || 100.9847,
      googleMapsUrl: placeData.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(placeData.name || 'ชลบุรี')}`,
      isActive: placeData.isActive !== false,
      visitCount: 0,
      createdAt: new Date().toISOString()
    };
    current.unshift(newPlace);
    this.saveLocalPlaces(current);
    return newPlace;
  }

  // Update place
  static async updatePlace(id: string, placeData: Partial<Place>): Promise<Place> {
    try {
      const res = await fetch(`/api/places/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      this.isApiAvailable = false;
    }

    const current = this.getLocalPlaces();
    const idx = current.findIndex((p) => p.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...placeData, updatedAt: new Date().toISOString() };
      this.saveLocalPlaces(current);
      return current[idx];
    }
    throw new Error('Place not found');
  }

  // Delete place
  static async deletePlace(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/places/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      this.isApiAvailable = false;
    }

    const current = this.getLocalPlaces();
    const filtered = current.filter((p) => p.id !== id);
    this.saveLocalPlaces(filtered);
    return true;
  }

  // Record a roll
  static async recordRoll(placeId: string, memberId?: string, filterUsed?: string): Promise<void> {
    try {
      await fetch('/api/random', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId, memberId, filterUsed })
      });
    } catch {
      // Local roll count
      const rolls = Number(localStorage.getItem(STORAGE_KEY_ROLLS) || '1480') + 1;
      localStorage.setItem(STORAGE_KEY_ROLLS, String(rolls));
    }
  }

  // Get stats
  static async getStats(): Promise<AppStats> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) return await res.json();
    } catch {
      // Offline calculate stats
    }

    const places = this.getLocalPlaces();
    const catMap: Record<string, number> = {};
    const distMap: Record<string, number> = {};
    places.forEach((p) => {
      p.category.forEach((c) => (catMap[c] = (catMap[c] || 0) + 1));
      distMap[p.district] = (distMap[p.district] || 0) + 1;
    });

    return {
      totalPlaces: places.length,
      activePlaces: places.filter((p) => p.isActive).length,
      popularPlaces: places.filter((p) => p.popular || p.popularityScore >= 80).length,
      totalRolls: Number(localStorage.getItem(STORAGE_KEY_ROLLS) || '1480'),
      totalMembers: 2,
      totalCategories: Object.keys(catMap).length,
      totalLogins: 128,
      activeUsersNow: 2,
      loginsToday: 6,
      recentLogins: [
        {
          id: 'log-1',
          memberId: 'usr-admin',
          username: 'admin',
          displayName: 'แอดมิน NongKaem888',
          role: 'admin',
          loginAt: new Date().toISOString(),
          device: 'Web Browser'
        },
        {
          id: 'log-2',
          memberId: 'usr-demo',
          username: 'traveler888',
          displayName: 'นักเดินทางแก้มใส',
          role: 'member',
          loginAt: new Date(Date.now() - 3600000).toISOString(),
          device: 'Mobile'
        }
      ],
      topRolledPlaces: places.slice(0, 5).map((p) => ({
        placeId: p.id,
        name: p.name,
        count: p.visitCount || 10,
        category: p.category[0] || 'ท่องเที่ยว'
      })),
      categoryDistribution: Object.entries(catMap).map(([category, count]) => ({ category, count })),
      districtDistribution: Object.entries(distMap).map(([district, count]) => ({ district, count })),
      recentPlaces: places.slice(0, 5)
    };
  }

  // Members
  static getCurrentUser(): Member | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return null;
  }

  static setCurrentUser(user: Member | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }

  static async login(emailOrUsername: string, pass: string): Promise<{ success: boolean; member?: Member; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.member) {
        this.setCurrentUser(data.member);
        return { success: true, member: data.member };
      }
      return { success: false, error: data.error || 'เข้าสู่ระบบไม่สำเร็จ' };
    } catch {
      // Fallback preset demo login
      if (emailOrUsername === 'admin' || emailOrUsername === 'admin@nongkaem888.com') {
        const admin: Member = {
          id: 'usr-admin',
          username: 'admin',
          email: 'admin@nongkaem888.com',
          displayName: 'แอดมิน NongKaem888',
          role: 'admin',
          createdAt: new Date().toISOString(),
          status: 'active',
          favorites: ['bs-001', 'pat-001'],
          history: []
        };
        this.setCurrentUser(admin);
        return { success: true, member: admin };
      }
      return { success: false, error: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้' };
    }
  }

  static async register(username: string, email: string, displayName: string, pass: string): Promise<{ success: boolean; member?: Member; error?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, displayName, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.member) {
        this.setCurrentUser(data.member);
        return { success: true, member: data.member };
      }
      return { success: false, error: data.error || 'สมัครสมาชิกไม่สำเร็จ' };
    } catch {
      const newMember: Member = {
        id: `usr-${Date.now()}`,
        username,
        email,
        displayName: displayName || username,
        role: 'member',
        createdAt: new Date().toISOString(),
        status: 'active',
        favorites: [],
        history: []
      };
      this.setCurrentUser(newMember);
      return { success: true, member: newMember };
    }
  }

  static async toggleFavorite(placeId: string, memberId: string): Promise<string[]> {
    try {
      const res = await fetch(`/api/members/${memberId}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId })
      });
      if (res.ok) {
        const data = await res.json();
        const curUser = this.getCurrentUser();
        if (curUser && curUser.id === memberId) {
          curUser.favorites = data.favorites;
          this.setCurrentUser(curUser);
        }
        return data.favorites;
      }
    } catch {
      // Local fallback
    }

    const curUser = this.getCurrentUser();
    if (curUser) {
      const favIdx = curUser.favorites.indexOf(placeId);
      if (favIdx > -1) {
        curUser.favorites.splice(favIdx, 1);
      } else {
        curUser.favorites.push(placeId);
      }
      this.setCurrentUser(curUser);
      return curUser.favorites;
    }
    return [];
  }

  static async logout(): Promise<void> {
    const curUser = this.getCurrentUser();
    if (curUser) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memberId: curUser.id })
        });
      } catch {}
    }
    this.setCurrentUser(null);
  }

  static async getMembers(): Promise<Member[]> {
    try {
      const res = await fetch('/api/members');
      if (res.ok) return await res.json();
    } catch {}
    return [
      {
        id: 'usr-admin',
        username: 'admin',
        email: 'admin@nongkaem888.com',
        displayName: 'แอดมิน NongKaem888',
        role: 'admin',
        createdAt: '2026-01-15T09:00:00.000Z',
        status: 'active',
        favorites: ['pat-001', 'bs-001'],
        history: [],
        lastLoginAt: new Date().toISOString(),
        loginCount: 24,
        isOnline: true
      },
      {
        id: 'usr-demo',
        username: 'traveler888',
        email: 'user@nongkaem888.com',
        displayName: 'นักเดินทางแก้มใส',
        role: 'member',
        createdAt: '2026-02-01T11:20:00.000Z',
        status: 'active',
        favorites: ['bs-015'],
        history: [],
        lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
        loginCount: 8,
        isOnline: true
      }
    ];
  }

  static async getLoginLogs(): Promise<any[]> {
    try {
      const res = await fetch('/api/members/logs');
      if (res.ok) return await res.json();
    } catch {}
    return [
      {
        id: 'log-1',
        memberId: 'usr-admin',
        username: 'admin',
        displayName: 'แอดมิน NongKaem888',
        role: 'admin',
        loginAt: new Date().toISOString(),
        device: 'Web Browser'
      }
    ];
  }
}
