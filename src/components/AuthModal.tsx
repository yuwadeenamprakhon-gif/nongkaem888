import React, { useState } from 'react';
import { X, User, Lock, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { Member } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (member: Member) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await ApiService.login(username || email, password);
        if (res.success && res.member) {
          onSuccess(res.member);
          onClose();
        } else {
          setError(res.error || 'เข้าสู่ระบบไม่สำเร็จ');
        }
      } else {
        if (!username || !email || !password) {
          setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
          setLoading(false);
          return;
        }
        const res = await ApiService.register(username, email, displayName || username, password);
        if (res.success && res.member) {
          onSuccess(res.member);
          onClose();
        } else {
          setError(res.error || 'สมัครสมาชิกไม่สำเร็จ');
        }
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdminDemo = () => {
    setUsername('admin');
    setPassword('admin888');
    setMode('login');
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-container"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs mb-2">
            <User className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-black">
            {mode === 'login' ? 'เข้าสู่ระบบสมาชิก' : 'สมัครสมาชิกใหม่'}
          </h3>
          <p className="text-xs text-amber-100 mt-0.5">
            บันทึกสถานที่โปรด ดูประวัติการสุ่ม และสิทธิ์พิเศษ
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อที่แสดง (Display Name)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="เช่น แก้มใส พาเที่ยว"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {mode === 'login' ? 'ชื่อผู้ใช้ หรือ อีเมล' : 'ชื่อผู้ใช้ (Username)'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'login' ? 'admin หรือ your_email@domain.com' : 'เช่น traveler888'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                อีเมล (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your_email@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {loading
              ? 'กำลังดำเนินการ...'
              : mode === 'login'
              ? 'เข้าสู่ระบบ'
              : 'สมัครสมาชิก'}
          </button>

          {/* Quick Demo Credentials for presentation */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleFillAdminDemo}
              className="w-full py-1.5 px-3 rounded-lg border border-dashed border-amber-300 bg-amber-50/70 text-[11px] font-medium text-amber-800 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>🔑 คลิกเพื่อกรอกรหัส Admin Demo (admin / admin888)</span>
            </button>
          </div>

          {/* Switch Mode */}
          <div className="text-center pt-2 text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                ยังไม่มีบัญชีสมาชิก?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="font-bold text-amber-600 hover:underline"
                >
                  สมัครสมาชิกที่นี่
                </button>
              </span>
            ) : (
              <span>
                มีบัญชีอยู่แล้ว?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-bold text-amber-600 hover:underline"
                >
                  เข้าสู่ระบบ
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
