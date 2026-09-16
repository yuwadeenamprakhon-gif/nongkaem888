import React from 'react';
import { Calendar, CheckCircle2, Clock, Sparkles, FolderGit2, Rocket } from 'lucide-react';

interface PhaseItem {
  phase: number;
  title: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'planned';
  description: string;
  deliverables: string[];
}

export const TimelinePage: React.FC = () => {
  const phases: PhaseItem[] = [
    {
      phase: 1,
      title: 'Requirement Gathering & Architecture Planning',
      duration: 'Week 1',
      status: 'completed',
      description: 'วิเคราะห์ความต้องการ ออกแบบระบบ NongKaem888 รองรับผู้ใช้งานจริง และวางโครงสร้างแบบแยก Data Layer กับ UI',
      deliverables: [
        'กำหนดคุณสมบัติเว็บ: สุ่มสถานที่จริงในชลบุรี, รองรับ 100-500+ สถานที่',
        'วางโครงสร้าง TypeScript Interface (Place, Member, AppStats)',
        'ออกแบบสถาปัตยกรรม Mobile-First และระบบ Lucky Draw Animation'
      ]
    },
    {
      phase: 2,
      title: 'Data Collection & Database Modeling (105+ Real Locations)',
      duration: 'Week 1 - 2',
      status: 'completed',
      description: 'รวบรวมข้อมูลสถานที่จริงในจังหวัดชลบุรีครบทุกอำเภอหลัก ไม่จำกัดแค่ที่เที่ยว แต่รวมถึงของกิน ห้าง คาเฟ่ เกาะ วัด จุดถ่ายรูป',
      deliverables: [
        'พัทยาและบางละมุง: 35 สถานที่พร้อมพิกัด, เวลาเปิด, ระดับราคา, Google Maps',
        'บางแสนและเมืองชลบุรี: 35 สถานที่ยอดนิยมและร้านเด็ด',
        'สัตหีบ เกาะล้าน เกาะสีชัง ศรีราชา และพื้นที่อื่นๆ: 35 สถานที่',
        'ระบบแท็ก คะแนนความนิยม (Popularity Score) และเงื่อนไขการกรอง'
      ]
    },
    {
      phase: 3,
      title: 'Frontend Development & Mobile-First UI/UX',
      duration: 'Week 2 - 3',
      status: 'completed',
      description: 'พัฒนาหน้าจอหลักด้วย React, TypeScript และ Tailwind CSS เน้นการแสดงผลคมชัด ใช้งานสะดวกด้วยมือเดียวบนสมาร์ตโฟน',
      deliverables: [
        'แบนเนอร์ “วันนี้ไปไหนดี?” พร้อมปุ่มสุ่มขนาดใหญ่พิเศษ (Mobile-First Touch Target)',
        'แผงควบคุมตัวกรองหมวดหมู่ด่วน 14 หมวดหมู่ (ทะเล, เกาะ, ห้าง, ของกิน, เดต, ฯลฯ)',
        'ระบบสลับอำเภอ / พื้นที่ในชลบุรีแบบไดนามิก',
        'การ์ดสถานที่สวยงาม Responsive Layout พร้อมปุ่มเปิด Google Maps และ Favorite'
      ]
    },
    {
      phase: 4,
      title: 'Random Engine & Weighted Algorithm',
      duration: 'Week 3',
      status: 'completed',
      description: 'พัฒนาระบบสุ่มอัจฉริยะ (RandomService) ที่คัดเลือกสถานที่ตามเงื่อนไข ป้องกันการสุ่มซ้ำ และกระจายน้ำหนักตามคะแนนความนิยม',
      deliverables: [
        'ฟังก์ชันกรองข้อมูลตามหมวดหมู่และอำเภอแบบยืดหยุ่น',
        'อัลกอริทึมสุ่มแบบ Weighted Score รองรับการเพิ่มสถานที่ 500+ แห่งโดยไม่ต้องแก้โค้ด',
        'ระบบสร้างลำดับการสลับชื่อสถานที่ (Cycling Sequence) สำหรับ Lucky Draw'
      ]
    },
    {
      phase: 5,
      title: 'Lucky Draw Animation & Result Modal Experience',
      duration: 'Week 3 - 4',
      status: 'completed',
      description: 'สร้างประสบการณ์ตื่นเต้นขณะกดสุ่มด้วย Slot Machine / Roulette Style Animation พร้อมเอฟเฟกต์พลุกระดาษ Confetti',
      deliverables: [
        'หน้าต่าง Lucky Draw หมุนสลับชื่อและรูปภาพอย่างรวดเร็วแล้วค่อยๆ ชะลอความเร็ว',
        'Popup แสดงผลลัพธ์: ชื่อสถานที่, ภาพ, หมวดหมู่, เวลาเปิด, ราคา, พิกัด',
        'ปุ่มทางลัด: นำทาง Google Maps ทันที, บันทึกสถานที่โปรด, ปุ่มสุ่มใหม่, แชร์'
      ]
    },
    {
      phase: 6,
      title: 'Member & Authentication System',
      duration: 'Week 4',
      status: 'completed',
      description: 'ระบบสมาชิก NongKaem888 รองรับการเข้าสู่ระบบ สมัครสมาชิก การบันทึกสถานที่โปรด และบันทึกประวัติการสุ่ม',
      deliverables: [
        'ฟอร์ม Login / Register พร้อมระบบจัดการเซสชันปลอดภัย',
        'การเก็บ Favorite List ซิงค์ข้อมูลกับบัญชีผู้ใช้',
        'ระบบประวัติการสุ่ม (Roll History) สามารถกดดูสถานที่ที่เคยสุ่มได้ย้อนหลัง'
      ]
    },
    {
      phase: 7,
      title: 'Admin Dashboard & Content Management System (CMS)',
      duration: 'Week 4 - 5',
      status: 'completed',
      description: 'หลังบ้านสำหรับผู้ดูแลระบบ จัดการสถานที่ (CRUD), ปรับแต่งคะแนนความนิยม, สถิติเรียลไทม์ และระบบสมาชิก',
      deliverables: [
        'ระบบความปลอดภัยด้วยรหัส Admin (admin888) หรือสิทธิ์ Admin Member',
        'ตารางจัดการสถานที่: เพิ่ม (Add), แก้ไข (Edit), ลบ (Delete), เปิด/ปิดการแสดงผล (Active)',
        'การวิเคราะห์สถิติ (Analytics): สัดส่วนสถานที่ตามหมวดหมู่และตามอำเภอ',
        'รายชื่อสมาชิกและการใช้งานระบบ'
      ]
    },
    {
      phase: 8,
      title: 'Database Architecture & API Integration',
      duration: 'Week 5',
      status: 'completed',
      description: 'สถาปัตยกรรม Backend ด้วย Express.js + Persistent Storage รองรับ Offline Fallback สำหรับ Vercel/GitHub Pages',
      deliverables: [
        'RESTful API: /api/places, /api/random, /api/stats, /api/auth, /api/members',
        'Persistent Database Storage รองรับการขยายตัว',
        'ระบบ Hybrid Fallback ซิงค์กับ LocalStorage ทำงานได้สมบูรณ์แม้ออฟไลน์'
      ]
    },
    {
      phase: 9,
      title: 'Testing, Responsive Validation & Performance Optimization',
      duration: 'Week 5 - 6',
      status: 'completed',
      description: 'ทดสอบความสมบูรณ์บนอุปกรณ์จริง (สมาร์ตโฟน, แท็บเล็ต, เดสก์ท็อป) และตรวจสอบโค้ด TypeScript Strict',
      deliverables: [
        'ตรวจสอบความเข้ากันได้ 100% กับหน้าจอขนาดต่างๆ (Mobile-First)',
        'ตรวจสอบรูปภาพและ Fallback เมื่อโหลดไม่สำเร็จ',
        'ทดสอบคำสั่ง npm run lint และ npm run build ผ่าน 100% ไร้ Error'
      ]
    },
    {
      phase: 10,
      title: 'GitHub Repository & Production Deployment on Vercel',
      duration: 'Week 6',
      status: 'completed',
      description: 'จัดเตรียม Repository พร้อมคู่มือ README.md และ Deploy สดขึ้น Vercel พร้อมใช้งานออนไลน์ได้จริง',
      deliverables: [
        'สร้าง README.md อย่างละเอียด พร้อมตาราง Phase, สถาปัตยกรรม, และวิธีรัน',
        'ตั้งค่า .gitignore, package.json, vite.config.ts รองรับ Production Build',
        'ขั้นตอนการเชื่อมต่อ GitHub Repo และ Vercel Live Deployment'
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Project Timeline & Execution Roadmap</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          แผนการดำเนินงานและสถิติคืบหน้าโครงการ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          เอกสารสรุป 10 ขั้นตอนการพัฒนาเว็บไซต์ NongKaem888 – “วันนี้ไปไหนดี?”
          ตั้งแต่การวางโครงสร้างฐานข้อมูล จนถึงการนำขึ้นระบบออนไลน์จริง
        </p>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>ความคืบหน้ารวมของโครงการ (Overall Progress)</span>
            <span className="text-emerald-800 font-extrabold">100% COMPLETE (10/10 PHASES)</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden p-0.5">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 w-full" />
          </div>
        </div>
      </div>

      {/* Timeline Steps List */}
      <div className="space-y-4">
        {phases.map((p) => (
          <div
            key={p.phase}
            id={`phase-${p.phase}`}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-amber-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
                  {p.phase}
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900">
                    Phase {p.phase}: {p.title}
                  </h3>
                  <span className="text-xs text-slate-700 font-medium">
                    ระยะเวลาดำเนินการ: {p.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>สมบูรณ์แล้ว (100%)</span>
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {p.description}
              </p>

              <div>
                <span className="text-xs font-bold text-slate-800 block mb-1.5">
                  ผลงานและชิ้นงานหลักที่พัฒนา (Deliverables):
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                  {p.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
