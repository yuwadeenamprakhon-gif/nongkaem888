export interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  province: string;
  district: string;
  category: string[];
  tags: string[];
  popular: boolean;
  popularityScore: number;
  openingHours: string;
  priceLevel: string;
  suitableFor: string[];
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  isActive: boolean;
  gallery?: string[];
  visitCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Member {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'admin' | 'member';
  createdAt: string;
  status: 'active' | 'suspended';
  favorites: string[]; // array of Place IDs
  history: {
    placeId: string;
    placeName: string;
    rolledAt: string;
    filterUsed?: string;
  }[];
  lastLoginAt?: string;
  loginCount?: number;
  isOnline?: boolean;
}

export interface LoginLog {
  id: string;
  memberId: string;
  username: string;
  displayName: string;
  role: 'admin' | 'member';
  loginAt: string;
  device?: string;
}

export type FilterType =
  | 'all'
  | 'popular'
  | 'beach'
  | 'island'
  | 'mall'
  | 'food'
  | 'theme_park'
  | 'photo'
  | 'date'
  | 'family'
  | 'friends'
  | 'cafe'
  | 'temple'
  | 'nature';

export interface FilterOption {
  id: FilterType;
  label: string;
  emoji: string;
  description: string;
}

export interface AppStats {
  totalPlaces: number;
  activePlaces: number;
  popularPlaces: number;
  totalRolls: number;
  totalMembers: number;
  totalCategories: number;
  totalLogins: number;
  activeUsersNow: number;
  loginsToday: number;
  recentLogins: LoginLog[];
  topRolledPlaces: { placeId: string; name: string; count: number; category: string }[];
  categoryDistribution: { category: string; count: number }[];
  districtDistribution: { district: string; count: number }[];
  recentPlaces: Place[];
}

export interface ProjectPhase {
  phase: number;
  title: string;
  status: 'completed' | 'in-progress' | 'planned';
  description: string;
  deliverables: string[];
  date: string;
}
