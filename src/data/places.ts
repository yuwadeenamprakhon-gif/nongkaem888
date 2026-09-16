import { Place, FilterType, FilterOption } from '../types';
import { PATTAYA_PLACES } from './placesPattaya';
import { BANGSAEN_PLACES } from './placesBangsaen';
import { SATTAHIP_ISLANDS_PLACES } from './placesSattahipIslands';

export const INITIAL_PLACES: Place[] = [
  ...PATTAYA_PLACES,
  ...BANGSAEN_PLACES,
  ...SATTAHIP_ISLANDS_PLACES
];

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
