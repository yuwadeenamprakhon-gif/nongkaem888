import React, { useState, useEffect } from 'react';
import { Place } from '../types';
import { X, Save, Plus, Trash2, MapPin, Tag } from 'lucide-react';
import { CHONBURI_DISTRICTS, CATEGORIES_LIST } from '../data/places';

interface AdminPlaceModalProps {
  isOpen: boolean;
  placeToEdit: Place | null;
  onClose: () => void;
  onSave: (placeData: Partial<Place>) => Promise<void>;
}

export const AdminPlaceModal: React.FC<AdminPlaceModalProps> = ({
  isOpen,
  placeToEdit,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Place>>({
    name: '',
    description: '',
    image: '',
    province: 'ชลบุรี',
    district: 'เมืองชลบุรี',
    category: ['จุดถ่ายรูป'],
    tags: ['chonburi'],
    popular: false,
    popularityScore: 80,
    openingHours: 'เปิดทุกวัน 08:00 - 18:00',
    priceLevel: 'ฟรี / ไม่มีค่าใช้จ่าย',
    suitableFor: ['เพื่อน', 'ครอบครัว'],
    googleMapsUrl: '',
    isActive: true
  });

  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (placeToEdit) {
      setFormData(placeToEdit);
      setTagInput(placeToEdit.tags.join(', '));
    } else {
      setFormData({
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        province: 'ชลบุรี',
        district: 'เมืองชลบุรี',
        category: ['จุดถ่ายรูป'],
        tags: ['chonburi'],
        popular: false,
        popularityScore: 80,
        openingHours: 'เปิดทุกวัน 08:00 - 18:00',
        priceLevel: 'ฟรี / ไม่มีค่าใช้จ่าย',
        suitableFor: ['เพื่อน', 'ครอบครัว'],
        googleMapsUrl: '',
        isActive: true
      });
      setTagInput('chonburi, travel');
    }
  }, [placeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleCategoryToggle = (cat: string) => {
    const current = formData.category || [];
    if (current.includes(cat)) {
      if (current.length > 1) {
        setFormData({ ...formData, category: current.filter((c) => c !== cat) });
      }
    } else {
      setFormData({ ...formData, category: [...current, cat] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsedTags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const placePayload: Partial<Place> = {
        ...formData,
        tags: parsedTags.length > 0 ? parsedTags : ['chonburi'],
        googleMapsUrl:
          formData.googleMapsUrl ||
          `https://maps.google.com/?q=${encodeURIComponent(formData.name || 'ชลบุรี')}`
      };

      await onSave(placePayload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {placeToEdit ? '✏️ แก้ไขข้อมูลสถานที่' : '➕ เพิ่มสถานที่ใหม่ (ชลบุรี)'}
            </h3>
            <p className="text-xs text-slate-400">
              ข้อมูลจะถูกบันทึกลงในระบบฐานข้อมูล NongKaem888 ทันที
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ชื่อสถานที่ *
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="เช่น หาดวอนนภา, ปราสาทสัจธรรม"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* District & Popularity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                อำเภอ / พื้นที่ในชลบุรี *
              </label>
              <select
                value={formData.district || 'เมืองชลบุรี'}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
              >
                {CHONBURI_DISTRICTS.filter((d) => d !== 'ทั้งหมด').map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                คะแนนความนิยม (0 - 100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.popularityScore || 80}
                onChange={(e) =>
                  setFormData({ ...formData, popularityScore: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              หมวดหมู่ (เลือกได้มากกว่า 1 ข้อ) *
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {CATEGORIES_LIST.map((cat) => {
                const isSelected = formData.category?.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              URL รูปภาพ (Image Link)
            </label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              คำอธิบายสถานที่
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="อธิบายจุดเด่น บรรยากาศ หรือสิ่งที่น่าสนใจ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Opening hours & Price Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                เวลาเปิด - ปิด
              </label>
              <input
                type="text"
                value={formData.openingHours || ''}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="เช่น เปิด 24 ชม., 09:00 - 18:00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ราคา / ค่าเข้า
              </label>
              <input
                type="text"
                value={formData.priceLevel || ''}
                onChange={(e) => setFormData({ ...formData, priceLevel: e.target.value })}
                placeholder="เช่น ฟรี, 100 - 300 บาท/คน"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Google Maps URL
            </label>
            <input
              type="text"
              value={formData.googleMapsUrl || ''}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              แท็ก (คั่นด้วยเครื่องหมายจุลภาค , )
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="beach, sunset, photo, cafe"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Switches (Popular & Active) */}
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.popular || false}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
              />
              <span className="font-semibold text-slate-700">🔥 ติดแท็กเป็นสถานที่ยอดนิยม</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isActive !== false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-400"
              />
              <span className="font-semibold text-slate-700">✅ เปิดใช้งานในระบบสุ่ม (Active)</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'กำลังบันทึก...' : 'บันทึกสถานที่'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
