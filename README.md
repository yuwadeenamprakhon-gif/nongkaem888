# NongKaem888 – “วันนี้ไปไหนดี?” (Chonburi Travel Randomizer) 🎲🌊

เว็บแอปพลิเคชันสุ่มสถานที่ท่องเที่ยวและจุดเช็คอินที่สามารถเดินทางไปได้จริงใน **จังหวัดชลบุรี** (พัทยา, บางแสน, สัตหีบ, ศรีราชา, เกาะล้าน, เกาะสีชัง, และอำเภออื่นๆ) พร้อมระบบสมาชิก, ระบบหลังบ้าน (Admin CMS), และ Lucky Draw Animation

---

## 🌟 จุดเด่นของระบบ (Core Features)

1. **ฐานข้อมูลสถานที่จริง 105+ แห่ง (ไม่ใช่ Mockup ทั่วไป):**
   - รวมสถานที่จริงครบทุกหมวด: ชายหาด, เกาะ, คาเฟ่, ตลาดโต้รุ่ง, ร้านอาหารเด็ด, สวนสนุก/สวนน้ำ, ห้างสรรพสินค้า, วัดศักดิ์สิทธิ์, จุดชมวิว, และกิจกรรม
   - มีข้อมูลครบถ้วน: ชื่อ, รูปภาพ, คำอธิบาย, เวลาเปิด-ปิด, ระดับราคา, ความเหมาะสม (คู่รัก, ครอบครัว, เพื่อน), พิกัด GPS และลิงก์ **Google Maps นำทางจริง**
   - โครงสร้างข้อมูลแยกจาก UI อย่างเป็นอิสระ รองรับการขยายเป็น 500+ สถานที่โดยไม่ต้องแก้โค้ดระบบสุ่ม

2. **ระบบ Lucky Draw Animation (ตื่นเต้นเหมือนวงล้อ / Slot Machine):**
   - เมื่อกดสุ่ม ระบบจะสลับรายชื่อและภาพสถานที่อย่างรวดเร็ว พร้อมลดความเร็วอย่างนุ่มนวลก่อนหยุดที่ผู้ชนะ
   - เอฟเฟกต์เฉลิมฉลอง Confetti และเปิด Popup ผลลัพธ์ขนาดใหญ่ สบายตาบนมือถือ (Mobile-First)

3. **ตัวกรองอัจฉริยะ (Smart Filters):**
   - กรองตามอำเภอ/โซน: ทั้งหมด, พัทยา, บางแสน, เมืองชลบุรี, ศรีราชา, สัตหีบ, เกาะล้าน, เกาะสีชัง, บ้านบึง ฯลฯ
   - กรองด่วน 14 หมวด: สุ่มสถานที่ดัง (คะแนน 80+), ทะเล, เกาะ, ห้าง, ของกิน, สวนสนุก, จุดถ่ายรูป, เดต, ครอบครัว, เพื่อน, คาเฟ่, วัด, ธรรมชาติ

4. **ระบบสมาชิก (Member System):**
   - ระบบ Register / Login
   - บันทึกสถานที่โปรด (Favorites) พร้อมซิงค์ทันที
   - บันทึกประวัติการสุ่ม (Roll History) ย้อนหลัง

5. **ระบบหลังบ้านผู้ดูแลระบบ (Admin CMS):**
   - ป้องกันด้วยสิทธิ์ Admin / รหัสผ่าน `admin888`
   - เพิ่ม (Add), แก้ไข (Edit), ลบ (Delete) สถานที่ได้ตลอดเวลา
   - เปิด/ปิดการแสดงผล (Active / Inactive) และสลับสถานะสถานที่ยอดนิยม (Popular)
   - แดชบอร์ดวิเคราะห์สถิติและการกระจายตัวของสถานที่

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **UI & Icons:** Lucide React, Canvas Confetti
- **Backend / API:** Node.js, Express.js (RESTful API)
- **Data Persistence:** JSON-based File DB with LocalStorage Fallback (100% resilient)

---

## 🚀 วิธีติดตั้งและรันบนเครื่องคอมพิวเตอร์ (Local Setup)

```bash
# 1. ติดตั้ง Dependencies ทั้งหมด
npm install

# 2. รันโหมด Development (รันทั้ง Express API + Vite บน Port 3000)
npm run dev

# 3. เปิดเบราว์เซอร์ที่:
http://localhost:3000
```

---

## 📦 วิธีการ Build และ Deploy สดขึ้น Vercel

ระบบได้รับการออกแบบให้ผ่านการตรวจสอบของ TypeScript และ Vite Build 100%:

```bash
# ทดสอบคำสั่ง Build
npm run build
```

### การนำขึ้น Vercel ผ่าน GitHub:
1. Push โค้ดทั้งหมดขึ้น GitHub Repository
2. เข้าสู่ [Vercel Dashboard](https://vercel.com) -> คลิก **Add New Project**
3. เลือก Repository ของคุณ
4. ตั้งค่า Build Command: `npm run build` และ Output Directory: `dist`
5. กด **Deploy** จะได้ URL ออนไลน์พร้อมใช้งานทันที

---

## 🔑 บัญชีทดสอบในระบบ (Demo Accounts)

| บทบาท | Username / Email | Password | รายละเอียด |
|---|---|---|---|
| **ผู้ดูแลระบบ (Admin)** | `admin` หรือ `admin@nongkaem888.com` | `admin888` | สิทธิ์เข้าถึงหน้า Admin CMS, จัดการสถานที่ทั้งหมด |
| **สมาชิกทั่วไป (Member)** | `traveler888` หรือ `user@nongkaem888.com` | `user123` | ตัวอย่างบัญชีสมาชิกที่มีสถานที่โปรดและประวัติการสุ่ม |

---

## 📅 สรุปขั้นตอนการพัฒนาโครงการ (Project Roadmap)

- **Phase 1:** Requirement Gathering & System Architecture
- **Phase 2:** Data Collection & Database Modeling (105+ Real Locations)
- **Phase 3:** Frontend Development & Mobile-First UI/UX
- **Phase 4:** Random Engine & Weighted Algorithm
- **Phase 5:** Lucky Draw Animation & Result Modal Experience
- **Phase 6:** Member & Authentication System
- **Phase 7:** Admin Dashboard & Content Management System (CMS)
- **Phase 8:** Database Architecture & API Integration
- **Phase 9:** Testing, Responsive Validation & Performance Optimization
- **Phase 10:** GitHub Repository & Production Deployment on Vercel
