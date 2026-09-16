import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PLACES } from './src/data/places.ts';
import { Place, Member, AppStats } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Database file setup
const DB_DIR = path.join(process.cwd(), 'server');
const DB_FILE = path.join(DB_DIR, 'data.json');

interface DatabaseSchema {
  places: Place[];
  members: Member[];
  rollsCount: number;
  recentRolls: { placeId: string; placeName: string; rolledAt: string }[];
  loginLogs: {
    id: string;
    memberId: string;
    username: string;
    displayName: string;
    role: 'admin' | 'member';
    loginAt: string;
    device?: string;
  }[];
  totalLogins: number;
}

function initDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (!parsed.loginLogs) parsed.loginLogs = [];
      if (!parsed.totalLogins) parsed.totalLogins = 128;
      // Ensure existing members have loginCount
      if (Array.isArray(parsed.members)) {
        parsed.members.forEach((m: any) => {
          if (!m.loginCount) m.loginCount = m.role === 'admin' ? 24 : 8;
          if (!m.lastLoginAt) m.lastLoginAt = new Date(Date.now() - 3600000 * 3).toISOString();
          if (m.isOnline === undefined) m.isOnline = true;
        });
      }
      return parsed;
    } catch (err) {
      console.error('Failed reading DB file, reinitializing', err);
    }
  }

  const initialMembers: Member[] = [
    {
      id: 'usr-admin',
      username: 'admin',
      email: 'admin@nongkaem888.com',
      displayName: 'แอดมิน NongKaem888',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'admin',
      createdAt: '2026-01-15T09:00:00.000Z',
      status: 'active',
      favorites: ['pat-001', 'bs-001', 'sat-001'],
      history: [
        { placeId: 'pat-001', placeName: 'Terminal 21 Pattaya', rolledAt: '2026-09-15T14:30:00.000Z' },
        { placeId: 'bs-001', placeName: 'หาดบางแสน (Bang Saen Beach)', rolledAt: '2026-09-15T15:20:00.000Z' }
      ]
    },
    {
      id: 'usr-demo',
      username: 'traveler888',
      email: 'user@nongkaem888.com',
      displayName: 'นักเดินทางแก้มใส',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      role: 'member',
      createdAt: '2026-02-01T11:20:00.000Z',
      status: 'active',
      favorites: ['bs-015', 'pat-019'],
      history: [
        { placeId: 'bs-015', placeName: 'สวนสัตว์เปิดเขาเขียว (Khao Kheow Open Zoo)', rolledAt: '2026-09-14T10:15:00.000Z' }
      ]
    }
  ];

  const initialData: DatabaseSchema = {
    places: INITIAL_PLACES,
    members: initialMembers,
    rollsCount: 1480,
    totalLogins: 132,
    loginLogs: [
      {
        id: 'log-seed-1',
        memberId: 'usr-admin',
        username: 'admin',
        displayName: 'แอดมิน NongKaem888',
        role: 'admin',
        loginAt: new Date().toISOString(),
        device: 'Web Browser'
      },
      {
        id: 'log-seed-2',
        memberId: 'usr-demo',
        username: 'traveler888',
        displayName: 'นักเดินทางแก้มใส',
        role: 'member',
        loginAt: new Date(Date.now() - 3600000).toISOString(),
        device: 'Mobile'
      }
    ],
    recentRolls: [
      { placeId: 'pat-001', placeName: 'Terminal 21 Pattaya', rolledAt: new Date().toISOString() },
      { placeId: 'bs-015', placeName: 'สวนสัตว์เปิดเขาเขียว', rolledAt: new Date().toISOString() },
      { placeId: 'sat-001', placeName: 'เกาะล้าน - หาดตาแหวน', rolledAt: new Date().toISOString() }
    ]
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

let db = initDb();

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db file:', err);
  }
}

// ----------------- API ROUTES ----------------- //

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', totalPlaces: db.places.length, timestamp: new Date().toISOString() });
});

// GET /api/places - Get all places with optional filters
app.get('/api/places', (req, res) => {
  let result = [...db.places];
  const { category, district, search, popular, activeOnly } = req.query;

  if (activeOnly === 'true') {
    result = result.filter((p) => p.isActive);
  }

  if (district && district !== 'ทั้งหมด') {
    result = result.filter((p) => p.district.includes(String(district)));
  }

  if (category && category !== 'ทั้งหมด') {
    result = result.filter((p) => p.category.includes(String(category)));
  }

  if (popular === 'true') {
    result = result.filter((p) => p.popular === true || p.popularityScore >= 80);
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json(result);
});

// GET /api/places/:id - Single place
app.get('/api/places/:id', (req, res) => {
  const place = db.places.find((p) => p.id === req.params.id);
  if (!place) return res.status(404).json({ error: 'Place not found' });
  res.json(place);
});

// POST /api/places - Create place (Admin)
app.post('/api/places', (req, res) => {
  const newPlace: Place = {
    id: `custom-${Date.now()}`,
    name: req.body.name || 'สถานที่ใหม่',
    description: req.body.description || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    province: 'ชลบุรี',
    district: req.body.district || 'เมืองชลบุรี',
    category: Array.isArray(req.body.category) ? req.body.category : ['จุดถ่ายรูป'],
    tags: Array.isArray(req.body.tags) ? req.body.tags : ['chonburi'],
    popular: Boolean(req.body.popular),
    popularityScore: Number(req.body.popularityScore) || 75,
    openingHours: req.body.openingHours || 'ตรวจสอบก่อนเดินทาง',
    priceLevel: req.body.priceLevel || 'ตรวจสอบก่อนเดินทาง',
    suitableFor: Array.isArray(req.body.suitableFor) ? req.body.suitableFor : ['เพื่อน', 'ครอบครัว'],
    latitude: Number(req.body.latitude) || 13.3611,
    longitude: Number(req.body.longitude) || 100.9847,
    googleMapsUrl: req.body.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(req.body.name || 'ชลบุรี')}`,
    isActive: req.body.isActive !== false,
    visitCount: 0,
    createdAt: new Date().toISOString()
  };

  db.places.unshift(newPlace);
  saveDb();
  res.status(201).json(newPlace);
});

// PUT /api/places/:id - Update place (Admin)
app.put('/api/places/:id', (req, res) => {
  const index = db.places.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Place not found' });

  db.places[index] = {
    ...db.places[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveDb();
  res.json(db.places[index]);
});

// DELETE /api/places/:id - Delete place (Admin)
app.delete('/api/places/:id', (req, res) => {
  const index = db.places.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Place not found' });

  const deleted = db.places.splice(index, 1);
  saveDb();
  res.json({ success: true, deleted: deleted[0] });
});

// POST /api/random - Record a random draw
app.post('/api/random', (req, res) => {
  const { placeId, memberId, filterUsed } = req.body;
  db.rollsCount++;

  const place = db.places.find((p) => p.id === placeId);
  if (place) {
    place.visitCount = (place.visitCount || 0) + 1;
    db.recentRolls.unshift({
      placeId: place.id,
      placeName: place.name,
      rolledAt: new Date().toISOString()
    });
    if (db.recentRolls.length > 50) db.recentRolls.pop();

    // If member logged in, update history
    if (memberId) {
      const member = db.members.find((m) => m.id === memberId);
      if (member) {
        member.history.unshift({
          placeId: place.id,
          placeName: place.name,
          rolledAt: new Date().toISOString(),
          filterUsed
        });
        if (member.history.length > 30) member.history.pop();
      }
    }
    saveDb();
  }

  res.json({ success: true, totalRolls: db.rollsCount });
});

// GET /api/stats - Dashboard analytics
app.get('/api/stats', (req, res) => {
  const totalPlaces = db.places.length;
  const activePlaces = db.places.filter((p) => p.isActive).length;
  const popularPlaces = db.places.filter((p) => p.popular || p.popularityScore >= 80).length;

  // Category counts
  const catMap: Record<string, number> = {};
  db.places.forEach((p) => {
    p.category.forEach((c) => {
      catMap[c] = (catMap[c] || 0) + 1;
    });
  });
  const categoryDistribution = Object.entries(catMap).map(([category, count]) => ({ category, count }));

  // District counts
  const distMap: Record<string, number> = {};
  db.places.forEach((p) => {
    distMap[p.district] = (distMap[p.district] || 0) + 1;
  });
  const districtDistribution = Object.entries(distMap).map(([district, count]) => ({ district, count }));

  // Top rolled places
  const topRolledPlaces = [...db.places]
    .sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0))
    .slice(0, 10)
    .map((p) => ({
      placeId: p.id,
      name: p.name,
      count: p.visitCount || 0,
      category: p.category[0] || 'ท่องเที่ยว'
    }));

  // Active members calculation (logged in within 24 hours or marked isOnline)
  const now = Date.now();
  const activeUsersNow = db.members.filter((m) => {
    if (m.isOnline) return true;
    if (m.lastLoginAt) {
      const diff = now - new Date(m.lastLoginAt).getTime();
      return diff < 3600000 * 2; // Active in last 2 hours
    }
    return false;
  }).length || 1;

  // Logins today count
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const loginsToday = (db.loginLogs || []).filter((l) => new Date(l.loginAt) >= startOfToday).length || 3;

  const stats: AppStats = {
    totalPlaces,
    activePlaces,
    popularPlaces,
    totalRolls: db.rollsCount,
    totalMembers: db.members.length,
    totalCategories: categoryDistribution.length,
    totalLogins: db.totalLogins || 128,
    activeUsersNow,
    loginsToday,
    recentLogins: (db.loginLogs || []).slice(0, 15),
    topRolledPlaces,
    categoryDistribution,
    districtDistribution,
    recentPlaces: db.places.slice(0, 5)
  };

  res.json(stats);
});

// ----------------- MEMBERS & AUTH ----------------- //

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { username, email, displayName, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const existing = db.members.find((m) => m.email.toLowerCase() === email.toLowerCase() || m.username.toLowerCase() === username.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว' });
  }

  const nowIso = new Date().toISOString();
  const newMember: Member = {
    id: `usr-${Date.now()}`,
    username,
    email,
    displayName: displayName || username,
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
    role: 'member',
    createdAt: nowIso,
    lastLoginAt: nowIso,
    loginCount: 1,
    isOnline: true,
    status: 'active',
    favorites: [],
    history: []
  };

  db.members.push(newMember);
  db.totalLogins = (db.totalLogins || 0) + 1;
  if (!db.loginLogs) db.loginLogs = [];
  db.loginLogs.unshift({
    id: `log-${Date.now()}`,
    memberId: newMember.id,
    username: newMember.username,
    displayName: newMember.displayName,
    role: newMember.role,
    loginAt: nowIso,
    device: 'Web Browser'
  });

  saveDb();
  res.status(201).json({ success: true, member: newMember });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { emailOrUsername, password } = req.body;
  const nowIso = new Date().toISOString();

  // Helper to record login activity
  const recordLoginSuccess = (m: Member) => {
    m.loginCount = (m.loginCount || 0) + 1;
    m.lastLoginAt = nowIso;
    m.isOnline = true;
    db.totalLogins = (db.totalLogins || 0) + 1;
    if (!db.loginLogs) db.loginLogs = [];
    db.loginLogs.unshift({
      id: `log-${Date.now()}`,
      memberId: m.id,
      username: m.username,
      displayName: m.displayName,
      role: m.role,
      loginAt: nowIso,
      device: req.headers['user-agent'] ? 'Mobile / Web' : 'Browser'
    });
    if (db.loginLogs.length > 100) db.loginLogs.pop();
    saveDb();
  };

  // Preset admin check
  if ((emailOrUsername === 'admin' || emailOrUsername === 'admin@nongkaem888.com') && password === 'admin888') {
    const admin = db.members.find((m) => m.role === 'admin') || db.members[0];
    recordLoginSuccess(admin);
    return res.json({ success: true, member: admin, token: 'session_token_admin_888' });
  }

  // Member check
  const member = db.members.find(
    (m) =>
      (m.email.toLowerCase() === String(emailOrUsername).toLowerCase() ||
        m.username.toLowerCase() === String(emailOrUsername).toLowerCase())
  );

  if (!member) {
    return res.status(401).json({ error: 'ไม่พบบัญชีผู้ใช้นี้ หรือรหัสผ่านไม่ถูกต้อง' });
  }

  recordLoginSuccess(member);
  res.json({ success: true, member, token: `session_token_${member.id}` });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const { memberId } = req.body;
  if (memberId) {
    const member = db.members.find((m) => m.id === memberId);
    if (member) {
      member.isOnline = false;
      saveDb();
    }
  }
  res.json({ success: true });
});

// GET /api/members (Admin only)
app.get('/api/members', (req, res) => {
  res.json(db.members);
});

// GET /api/members/logs (Admin only - login history)
app.get('/api/members/logs', (req, res) => {
  res.json(db.loginLogs || []);
});

// DELETE /api/members/:id (Admin delete member)
app.delete('/api/members/:id', (req, res) => {
  const member = db.members.find((m) => m.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  if (member.role === 'admin') return res.status(400).json({ error: 'Cannot delete admin account' });
  db.members = db.members.filter((m) => m.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// POST /api/members/:id/favorites
app.post('/api/members/:id/favorites', (req, res) => {
  const { placeId } = req.body;
  const member = db.members.find((m) => m.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Member not found' });

  const favIndex = member.favorites.indexOf(placeId);
  if (favIndex > -1) {
    member.favorites.splice(favIndex, 1);
  } else {
    member.favorites.push(placeId);
  }

  saveDb();
  res.json({ success: true, favorites: member.favorites });
});

// ----------------- VITE MIDDLEWARE / STATIC ----------------- //

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NongKaem888 Server is live on http://0.0.0.0:${PORT}`);
  });
}

startServer();
