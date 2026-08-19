import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Leaf, GraduationCap, BookOpen, Building, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

const roles = [
  { id: 'student', label: 'Student', icon: GraduationCap, color: 'from-green-500 to-emerald-600', glow: 'rgba(34,197,94,0.3)', desc: 'Learn, play & earn eco points', defaultEmail: 'ananya@student.eco' },
  { id: 'teacher', label: 'Teacher', icon: BookOpen, color: 'from-blue-500 to-indigo-600', glow: 'rgba(59,130,246,0.3)', desc: 'Manage classes & grade students', defaultEmail: 'meera@teacher.eco' },
  { id: 'organizer', label: 'Organizer', icon: Building, color: 'from-purple-500 to-pink-600', glow: 'rgba(168,85,247,0.3)', desc: 'Manage schools & competitions', defaultEmail: 'lakshmi@organizer.eco' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(role.defaultEmail);
    setPassword('demo123');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password, selectedRole.id);
      const routes = { student: '/student', teacher: '/teacher', organizer: '/organizer' };
      navigate(routes[user.role] || '/student');
    } catch (err) {
      setError('Invalid credentials. Try the default demo email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-eco-teal/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-eco-blue/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 glow-green"
          >
            <Leaf className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gradient mb-2">EcoLearn</h1>
          <p className="text-muted-foreground text-sm">Learn it. Play it. Do it. Prove it. Earn it.</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6">
          {!selectedRole ? (
            <>
              <h2 className="text-lg font-semibold text-center mb-6">Choose your role</h2>
              <div className="space-y-3">
                {roles.map((role, i) => (
                  <motion.button
                    key={role.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    onClick={() => handleRoleSelect(role)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 bg-secondary/30 hover:bg-secondary/60 transition-all duration-300 group"
                    style={{ '--glow': role.glow }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shrink-0 group-hover:shadow-lg transition-shadow`}>
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">{role.label}</p>
                      <p className="text-xs text-muted-foreground">{role.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            <AnimatePresence mode="wait">
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1 mb-2"
                >
                  ← Back to roles
                </button>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedRole.color} flex items-center justify-center`}>
                    <selectedRole.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selectedRole.label} Login</p>
                    <p className="text-xs text-muted-foreground">{selectedRole.desc}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition pr-10"
                      placeholder="Enter password"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
                    {error}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${selectedRole.color} hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  Demo mode • Pre-filled credentials ready
                </p>
              </motion.form>
            </AnimatePresence>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Gamified Environmental Education Platform • SIH 2026
        </p>
      </motion.div>
    </div>
  );
}
