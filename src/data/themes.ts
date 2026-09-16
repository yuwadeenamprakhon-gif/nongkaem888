export type ThemeId = 'cyber' | 'ocean' | 'sunset' | 'emerald' | 'midnight';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  thaiName: string;
  description: string;
  icon: string;
  colorSwatch: string[];
  bgHex: string;
  surfaceHex: string;
  navbarHex: string;
  footerHex: string;
  accentGradient: string;
  accentText: string;
  borderClass: string;
  badgeClass: string;
  glows: {
    c1: string;
    c2: string;
    c3: string;
    c4: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  cyber: {
    id: 'cyber',
    name: 'Cyber Twilight',
    thaiName: 'นีออนราตรี (Cyber Twilight)',
    description: 'ม่วง-ชมพู-น้ำเงิน สไตล์แสงสีนีออนพัทยาและไลฟ์สไตล์ราตรี',
    icon: '🔮',
    colorSwatch: ['#7c3aed', '#ec4899', '#3b82f6'],
    bgHex: '#070817',
    surfaceHex: '#0d0f2b',
    navbarHex: '#090b1e',
    footerHex: '#050612',
    accentGradient: 'from-purple-600 via-fuchsia-600 to-pink-500',
    accentText: 'text-pink-400',
    borderClass: 'border-purple-500/25',
    badgeClass: 'bg-purple-950 text-pink-300 border-purple-500/40',
    glows: {
      c1: 'bg-indigo-600/15',
      c2: 'bg-fuchsia-600/12',
      c3: 'bg-purple-600/10',
      c4: 'bg-pink-600/10'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Wave',
    thaiName: 'ทะเลพัทยา (Ocean Wave)',
    description: 'น้ำเงินคราม-ฟ้าทะเล-เทอร์ควอยซ์ ลมทะเลบางแสนและเกาะล้าน',
    icon: '🌊',
    colorSwatch: ['#0284c7', '#06b6d4', '#14b8a6'],
    bgHex: '#030f24',
    surfaceHex: '#071a38',
    navbarHex: '#04132e',
    footerHex: '#020b1c',
    accentGradient: 'from-blue-600 via-cyan-500 to-teal-400',
    accentText: 'text-cyan-400',
    borderClass: 'border-cyan-500/30',
    badgeClass: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
    glows: {
      c1: 'bg-blue-600/20',
      c2: 'bg-cyan-500/15',
      c3: 'bg-teal-500/12',
      c4: 'bg-sky-400/12'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Gold',
    thaiName: 'อัสดงหาดวอน (Sunset Gold)',
    description: 'ทองอำพัน-ส้มพีช-ชมพูคอรัล แสงอาทิตย์ตกดินหาดวอนนภา',
    icon: '🌅',
    colorSwatch: ['#ea580c', '#f59e0b', '#e11d48'],
    bgHex: '#140907',
    surfaceHex: '#22100d',
    navbarHex: '#1a0b08',
    footerHex: '#0f0504',
    accentGradient: 'from-rose-600 via-orange-500 to-amber-400',
    accentText: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    badgeClass: 'bg-amber-950 text-amber-300 border-amber-500/40',
    glows: {
      c1: 'bg-rose-600/18',
      c2: 'bg-orange-500/15',
      c3: 'bg-amber-500/12',
      c4: 'bg-red-500/10'
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    thaiName: 'ธรรมชาติเขาเขียว (Emerald Forest)',
    description: 'เขียวมรกต-มิ้นต์-ป่าเขา บรรยากาศสวนสัตว์เปิดเขาเขียวและอ่างเก็บน้ำบางพระ',
    icon: '🌿',
    colorSwatch: ['#059669', '#10b981', '#34d399'],
    bgHex: '#04140c',
    surfaceHex: '#092215',
    navbarHex: '#051a0f',
    footerHex: '#030e08',
    accentGradient: 'from-emerald-600 via-teal-500 to-green-400',
    accentText: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
    glows: {
      c1: 'bg-emerald-600/20',
      c2: 'bg-teal-500/15',
      c3: 'bg-green-500/12',
      c4: 'bg-lime-500/10'
    }
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Luxury',
    thaiName: 'มิดไนท์คาร์บอน (Midnight Luxury)',
    description: 'ดำสนิท-คาร์บอน-ม่วงครามเข้ม เรียบหรู เท่ สบายตาและประหยัดแบตเตอรี่',
    icon: '✨',
    colorSwatch: ['#475569', '#6366f1', '#a855f7'],
    bgHex: '#09090d',
    surfaceHex: '#12121a',
    navbarHex: '#0d0d14',
    footerHex: '#060609',
    accentGradient: 'from-indigo-600 via-violet-600 to-slate-400',
    accentText: 'text-violet-400',
    borderClass: 'border-violet-500/30',
    badgeClass: 'bg-slate-900 text-violet-300 border-violet-500/40',
    glows: {
      c1: 'bg-indigo-600/15',
      c2: 'bg-violet-600/12',
      c3: 'bg-purple-900/15',
      c4: 'bg-slate-700/12'
    }
  }
};

export const THEME_LIST = Object.values(THEMES);
