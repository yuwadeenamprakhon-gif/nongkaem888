import { Place, FilterType, FilterOption } from '../types';
import { PATTAYA_PLACES } from './placesPattaya';
import { BANGSAEN_PLACES } from './placesBangsaen';
import { SATTAHIP_ISLANDS_PLACES } from './placesSattahipIslands';

// Curated image pools for places without explicit gallery photos
const CATEGORY_PHOTO_POOLS: Record<string, string[]> = {
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  ],
  island: [
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1510414842594-a61752afb394?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  ],
  cafe: [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
  ],
  food: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80'
  ],
  mall: [
    'https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
  ],
  temple: [
    'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
  ],
  nature: [
    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
  ],
  theme_park: [
    'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
  ]
};

export function getPlaceGallery(place: Place): string[] {
  if (place.gallery && place.gallery.length >= 3) {
    return place.gallery;
  }

  const gallery: string[] = [place.image];

  // Determine category pool
  let poolKey = 'beach';
  const cats = place.category || [];
  if (cats.some((c) => c.includes('เกาะ'))) poolKey = 'island';
  else if (cats.some((c) => c.includes('คาเฟ่'))) poolKey = 'cafe';
  else if (cats.some((c) => c.includes('ของกิน') || c.includes('ตลาด'))) poolKey = 'food';
  else if (cats.some((c) => c.includes('ห้าง'))) poolKey = 'mall';
  else if (cats.some((c) => c.includes('วัด') || c.includes('ศักดิ์สิทธิ์'))) poolKey = 'temple';
  else if (cats.some((c) => c.includes('ธรรมชาติ') || c.includes('จุดชมวิว'))) poolKey = 'nature';
  else if (cats.some((c) => c.includes('สวนสนุก') || c.includes('สวนน้ำ'))) poolKey = 'theme_park';

  const pool = CATEGORY_PHOTO_POOLS[poolKey] || CATEGORY_PHOTO_POOLS.beach;

  // Add 3 more unique photos from the pool
  for (const img of pool) {
    if (!gallery.includes(img)) {
      gallery.push(img);
    }
    if (gallery.length >= 4) break;
  }

  return gallery;
}

export const INITIAL_PLACES: Place[] = [
  ...PATTAYA_PLACES,
  ...BANGSAEN_PLACES,
  ...SATTAHIP_ISLANDS_PLACES
].map((p) => ({
  ...p,
  gallery: getPlaceGallery(p)
}));

export const QUICK_FILTERS: FilterOption[] = [
  { id: 'all', label: 'สุ่มทั้งหมด', emoji: '🎲', description: 'สุ่มจากทุกประเภทและทุกพื้นที่ในชลบุรี' },
  { id: 'popular', label: 'สุ่มสถานที่ดัง', emoji: '🔥', description: 'สถานที่ยอดนิยม คะแนน 80+ ขึ้นไป' },
  { id: 'beach', label: 'ทะเล', emoji: '🌊', description: 'ชายหาด รับลมทะเล เล่นน้ำ ชมพระอาทิตย์ตก' },
  { id: 'island', label: 'เกาะ', emoji: '🏝️', description: 'เกาะล้าน เกาะสีชัง เกาะขาม เกาะแสมสาร' },
  { id: 'mall', label: 'ห้าง', emoji: '🛍️', description: 'ช้อปปิ้ง แอร์เย็น ร้านอาหาร โรงหนัง' },
  { id: 'food', label: 'ของกิน', emoji: '🍜', description: 'ร้านเด็ด สตรีทฟู้ด ตลาดโต้รุ่ง ซีฟู้ดสด' },
  { id: 'theme_park', label: 'สวนสนุก / สวนน้ำ', emoji: '🎡', description: 'เครื่องเล่น อควาเรียม สวนสัตว์' },
  { id: 'photo', label: 'ถ่ายรูป', emoji: '📸', description: 'มุมเก๋ จุดเช็คอิน คาเฟ่ วิวสวย' },
  { id: 'date', label: 'เดต', emoji: '❤️', description: 'บรรยากาศโรแมนติก วิวพระอาทิตย์ตก ดินเนอร์' },
  { id: 'family', label: 'ครอบครัว', emoji: '👨👩👧', description: 'เหมาะกับทุกวัย เด็ก ผู้ใหญ่ สบายและปลอดภัย' },
  { id: 'friends', label: 'เพื่อน', emoji: '👯', description: 'กิจกรรมสนุก กีฬา ไนท์ไลฟ์ ปาร์ตี้' },
  { id: 'cafe', label: 'คาเฟ่', emoji: '☕', description: 'กาแฟดี เบเกอรี่ ขนมหวาน วิวทะเล' },
  { id: 'temple', label: 'วัด / ศักดิ์สิทธิ์', emoji: '🙏', description: 'ไหว้พระ ขอพร เสริมสิริมงคล' },
  { id: 'nature', label: 'ธรรมชาติ', emoji: '🌿', description: 'ป่าชายเลน น้ำตก สวนสัตว์ อ่างเก็บน้ำ' }
];

export const CHONBURI_DISTRICTS = [
  'ทั้งหมด',
  'พัทยา',
  'บางละมุง',
  'เมืองชลบุรี',
  'ศรีราชา',
  'สัตหีบ',
  'เกาะล้าน/พัทยา',
  'เกาะสีชัง',
  'นาจอมเทียน',
  'บ้านบึง',
  'พนัสนิคม',
  'พานทอง'
];

export const CATEGORIES_LIST = [
  'ทะเล / ชายหาด',
  'เกาะ',
  'ห้าง / Shopping',
  'ตลาด',
  'สวนสนุก / สวนน้ำ',
  'ครอบครัว',
  'จุดถ่ายรูป',
  'จุดชมวิว',
  'คาเฟ่',
  'ของกิน',
  'กลางคืน',
  'วัด / สถานที่ศักดิ์สิทธิ์',
  'ธรรมชาติ',
  'กิจกรรม'
];
