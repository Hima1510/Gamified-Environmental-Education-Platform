import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockTopics } from '../../data/mockData';
import { BookOpen, Clock, Award, ChevronRight, Search, Filter } from 'lucide-react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function LearnPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const filtered = mockTopics.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'completed' && t.progress === 100) || (filter === 'in_progress' && t.progress > 0 && t.progress < 100) || (filter === 'not_started' && t.progress === 0);
    return matchSearch && matchFilter;
  });

  const lessons = [
    'Introduction to the Topic',
    'Key Concepts & Definitions',
    'Real-World Examples',
    'Environmental Impact Analysis',
    'Prevention & Solutions',
    'Community Action Steps',
    'Case Studies from India',
    'Assessment & Review',
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-6xl mx-auto">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" /> Environmental Learning
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Explore 9 environmental topics and complete lessons to earn Eco Points</p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary outline-none text-sm"
            placeholder="Search topics..."
          />
        </div>
        <div className="flex gap-2">
          {['all', 'in_progress', 'completed', 'not_started'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Topic Grid */}
      {!selectedTopic ? (
        <motion.div variants={container} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(topic => (
            <motion.div key={topic.id} variants={item} whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => setSelectedTopic(topic)}
              className="glass rounded-xl p-5 cursor-pointer group hover:border-primary/20 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ background: topic.color }} />
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{topic.icon}</span>
                <div>
                  <h3 className="font-semibold">{topic.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary" style={{ color: topic.color }}>{topic.difficulty}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{topic.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-medium text-foreground">{topic.progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${topic.progress}%` }} transition={{ duration: 1 }}
                    className="h-full rounded-full" style={{ background: topic.color }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{topic.completedLessons}/{topic.lessons} Lessons</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{topic.estimatedTime}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${topic.quizAvailable ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    Quiz {topic.quizAvailable ? 'Unlocked' : 'Locked'}
                  </span>
                  <span className="text-xs text-eco-green font-medium flex items-center gap-1"><Award className="w-3 h-3" />+{topic.points}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Topic Detail */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => setSelectedTopic(null)} className="text-sm text-muted-foreground hover:text-foreground transition mb-4 flex items-center gap-1">← Back to topics</button>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{selectedTopic.icon}</span>
              <div>
                <h2 className="text-xl font-bold">{selectedTopic.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedTopic.description}</p>
                <div className="flex gap-3 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary" style={{ color: selectedTopic.color }}>{selectedTopic.difficulty}</span>
                  <span className="text-xs text-muted-foreground">{selectedTopic.estimatedTime}</span>
                  <span className="text-xs text-eco-green">+{selectedTopic.points} Points</span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span className="font-medium">{selectedTopic.progress}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${selectedTopic.progress}%` }} transition={{ duration: 1 }}
                  className="h-full rounded-full" style={{ background: selectedTopic.color }} />
              </div>
            </div>
            <h3 className="font-semibold mb-3">Lessons</h3>
            <div className="space-y-2">
              {lessons.slice(0, selectedTopic.lessons).map((lesson, i) => {
                const completed = i < selectedTopic.completedLessons;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition ${completed ? 'bg-primary/5' : 'bg-secondary/50 hover:bg-secondary/80'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${completed ? 'gradient-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                      {completed ? '✓' : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${completed ? 'text-primary' : ''}`}>Lesson {i + 1}: {lesson}</p>
                      <p className="text-xs text-muted-foreground">{completed ? 'Completed' : i === selectedTopic.completedLessons ? 'Continue →' : 'Locked'}</p>
                    </div>
                    {completed && <span className="text-xs text-eco-green">+{Math.floor(selectedTopic.points / selectedTopic.lessons)} pts</span>}
                  </motion.div>
                );
              })}
            </div>
            {selectedTopic.quizAvailable && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="mt-4 w-full py-3 rounded-xl gradient-primary text-white font-semibold flex items-center justify-center gap-2">
                Take {selectedTopic.name} Quiz <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
