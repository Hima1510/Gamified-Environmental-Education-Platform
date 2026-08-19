const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- MOCK DATA ---
const users = [
  { id: 'u1', name: 'Ananya Sharma', email: 'ananya@student.eco', password: '$2b$10$mockhashedpassword', role: 'student', schoolId: 's1', classId: 'c1', points: 2450, streak: 5, level: 12, badges: 12 },
  { id: 't1', name: 'Dr. Meera Reddy', email: 'meera@teacher.eco', password: '$2b$10$mockhashedpassword', role: 'teacher', schoolId: 's1', classId: 'c1' },
  { id: 'o1', name: 'Mrs. Lakshmi Menon', email: 'lakshmi@organizer.eco', password: '$2b$10$mockhashedpassword', role: 'organizer' },
];

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const user = users.find(u => u.email === email && u.role === role);
  if (!user) {
    const defaultUser = users.find(u => u.role === role);
    if (defaultUser) {
      return res.json({ token: 'mock_jwt_' + Date.now(), user: { ...defaultUser, email } });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: 'mock_jwt_' + Date.now(), user });
});

app.get('/api/auth/profile', (req, res) => {
  res.json(users[0]);
});

// --- USERS ---
app.get('/api/users', (req, res) => res.json(users));
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  res.json(user || { error: 'Not found' });
});

// --- SCHOOLS ---
app.get('/api/schools', (req, res) => {
  res.json([
    { id: 's1', name: 'Green Valley School', location: 'Hyderabad', state: 'Telangana', students: 480, greenScore: 89.5 },
    { id: 's2', name: 'Sunrise Academy', location: 'Bangalore', state: 'Karnataka', students: 620, greenScore: 85.2 },
    { id: 's3', name: 'ABC Public School', location: 'Chennai', state: 'Tamil Nadu', students: 390, greenScore: 78.8 },
  ]);
});

// --- TOPICS ---
app.get('/api/topics', (req, res) => {
  res.json([
    { id: 'tp1', name: 'Climate Change', difficulty: 'Intermediate', lessons: 10 },
    { id: 'tp2', name: 'Waste Management', difficulty: 'Beginner', lessons: 8 },
    { id: 'tp3', name: 'Water Conservation', difficulty: 'Intermediate', lessons: 8 },
  ]);
});

// --- MISSIONS ---
app.get('/api/missions', (req, res) => {
  res.json([
    { id: 'm1', title: 'Plastic-Free Week', topic: 'Waste Management', difficulty: 'Medium', points: 100, verificationRequired: true },
    { id: 'm2', title: 'Water Saver', topic: 'Water Conservation', difficulty: 'Easy', points: 75, verificationRequired: true },
    { id: 'm5', title: 'Plant a Tree', topic: 'Biodiversity', difficulty: 'Hard', points: 200, verificationRequired: true },
  ]);
});

// --- SUBMISSIONS ---
app.get('/api/submissions', (req, res) => {
  res.json([
    { id: 'sub1', studentName: 'Ananya Sharma', missionTitle: 'Plant a Tree', aiConfidence: 94, status: 'awaiting_approval' },
  ]);
});

app.put('/api/submissions/:id/approve', (req, res) => {
  res.json({ success: true, message: 'Submission approved', pointsAwarded: 100 });
});

app.put('/api/submissions/:id/reject', (req, res) => {
  res.json({ success: true, message: 'Submission rejected' });
});

// --- LEADERBOARDS ---
app.get('/api/leaderboards/class/:id', (req, res) => {
  res.json([
    { rank: 1, name: 'Aarav Patel', points: 2850 },
    { rank: 2, name: 'Meghna Rao', points: 2680 },
    { rank: 7, name: 'Ananya Sharma', points: 2450 },
  ]);
});

// --- COMPETITIONS ---
app.get('/api/competitions', (req, res) => {
  res.json([
    { id: 'comp1', name: 'Inter-School Green Challenge 2026', status: 'upcoming', schools: 84, students: 12400 },
    { id: 'comp3', name: 'Clean City Initiative', status: 'active', schools: 45, students: 8900 },
  ]);
});

app.post('/api/competitions', (req, res) => {
  res.json({ success: true, competition: { id: 'comp_new', ...req.body, status: 'upcoming' } });
});

// --- BADGES ---
app.get('/api/badges', (req, res) => {
  res.json([
    { id: 'b1', name: 'Eco Starter', icon: '🌱', unlocked: true },
    { id: 'b2', name: 'Waste Warrior', icon: '♻️', unlocked: true },
    { id: 'b7', name: 'Eco Master', icon: '🏆', unlocked: false },
  ]);
});

// --- ANALYTICS ---
app.get('/api/analytics/platform', (req, res) => {
  res.json({ totalSchools: 128, totalStudents: 42850, totalTeachers: 2340, activeCompetitions: 16 });
});

// --- SOCKET.IO ---
let io;
try {
  const { Server } = require('socket.io');
  io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // Simulate live leaderboard update
    setTimeout(() => {
      socket.emit('leaderboard_update', { name: 'Ananya', from: 8, to: 7 });
    }, 5000);

    setTimeout(() => {
      socket.emit('notification', { type: 'points', message: '🎉 You earned 100 Eco Points!' });
    }, 8000);

    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
  });
} catch (e) {
  console.log('Socket.IO not installed, skipping real-time features');
}

// --- START ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🌿 GenGreen API running on port ${PORT}`);
  console.log(`   Routes: /api/auth, /api/users, /api/schools, /api/topics, /api/missions, /api/submissions, /api/leaderboards, /api/competitions, /api/badges, /api/analytics`);
});
