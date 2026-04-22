/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, KeyboardEvent } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Settings2, Palette, NotebookPen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

type Theme = 'grid' | 'pink' | 'green' | 'dark' | 'simple';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [theme, setTheme] = useState<Theme>('grid');

  // Load data
  useEffect(() => {
    const savedGoals = localStorage.getItem('study_goals_v2');
    const savedTheme = localStorage.getItem('study_theme');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedTheme) setTheme(savedTheme as Theme);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('study_goals_v2', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('study_theme', theme);
  }, [theme]);

  const addGoal = () => {
    if (!inputValue.trim()) return;
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
    };
    setGoals([...goals, newGoal]);
    setInputValue('');
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteCompleted = () => {
    setGoals(goals.filter(g => !g.completed));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addGoal();
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'grid':
        return {
          background: 'bg-white',
          pattern: 'grid-pattern',
          accent: 'text-blue-600',
          button: 'bg-blue-500 hover:bg-blue-600',
          card: 'bg-white/90 border-blue-100',
        };
      case 'pink':
        return {
          background: 'bg-[#fff5f7]',
          pattern: '',
          accent: 'text-pink-600',
          button: 'bg-pink-500 hover:bg-pink-600',
          card: 'bg-white border-pink-100',
        };
      case 'green':
        return {
          background: 'bg-[#f0fff4]',
          pattern: '',
          accent: 'text-emerald-600',
          button: 'bg-emerald-500 hover:bg-emerald-600',
          card: 'bg-white border-emerald-100',
        };
      case 'dark':
        return {
          background: 'bg-slate-900',
          pattern: '',
          accent: 'text-indigo-400',
          button: 'bg-indigo-600 hover:bg-indigo-700',
          card: 'bg-slate-800 border-slate-700 text-slate-100',
        };
      case 'simple':
        return {
          background: 'bg-slate-50',
          pattern: '',
          accent: 'text-slate-800',
          button: 'bg-slate-800 hover:bg-slate-900',
          card: 'bg-white border-slate-200',
        };
      default:
        return {
          background: 'bg-white',
          pattern: 'grid-pattern',
          accent: 'text-blue-600',
          button: 'bg-blue-500 hover:bg-blue-600',
          card: 'bg-white border-blue-100',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${styles.background} ${styles.pattern} p-4 md:p-8 font-sans`}>
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col items-center gap-4 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`p-4 rounded-full ${styles.accent} bg-white/50 backdrop-blur-sm shadow-xl`}
          >
            <NotebookPen size={48} />
          </motion.div>
          <div>
            <h1 className={`text-4xl font-bold tracking-tight mb-2 ${styles.accent === 'text-indigo-400' ? 'text-white' : 'text-slate-900'}`}>
              공부 목표 체커
            </h1>
            <p className={`${styles.accent === 'text-indigo-400' ? 'text-slate-400' : 'text-slate-500'}`}>
              오늘의 목표를 달성해 보세요!
            </p>
          </div>
        </header>

        {/* Theme Switcher */}
        <div className="flex justify-center gap-3 p-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm w-fit mx-auto">
          <button 
            onClick={() => setTheme('grid')}
            className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'grid' ? 'border-blue-500 scale-110' : 'border-transparent'} flex items-center justify-center bg-white shadow-sm overflow-hidden`}
            title="Sổ ô li"
          >
            <div className="w-full h-full grid-pattern-mini" />
          </button>
          <button 
            onClick={() => setTheme('pink')}
            className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'pink' ? 'border-pink-500 scale-110' : 'border-transparent'} bg-pink-100 shadow-sm`}
            title="Hồng ngọt ngào"
          />
          <button 
            onClick={() => setTheme('green')}
            className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'green' ? 'border-emerald-500 scale-110' : 'border-transparent'} bg-emerald-100 shadow-sm`}
            title="Xanh tươi mát"
          />
          <button 
            onClick={() => setTheme('dark')}
            className={`w-8 h-8 rounded-full border-2 transition-all ${theme === 'dark' ? 'border-indigo-400 scale-110' : 'border-transparent'} bg-slate-800 shadow-sm`}
            title="Chế độ tối"
          />
        </div>

        {/* Action Bar */}
        <div className={`p-2 rounded-2xl shadow-lg flex items-center gap-2 border ${styles.card}`}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="목표를 입력해 주세요..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-lg"
          />
          <button 
            onClick={addGoal}
            className={`p-3 rounded-xl text-white transition-all transform active:scale-95 flex items-center justify-center cursor-pointer ${styles.button}`}
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className={`font-semibold flex items-center gap-2 ${styles.accent === 'text-indigo-400' ? 'text-slate-300' : 'text-slate-700'}`}>
              <Palette size={18} />
              나의 목표 목록
            </h2>
            {goals.some(g => g.completed) && (
              <button 
                onClick={deleteCompleted}
                className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
                완료된 항목 삭제
              </button>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {goals.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-12 rounded-3xl border-2 border-dashed ${styles.accent === 'text-indigo-400' ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'}`}
                >
                  <p>아직 목표가 없어요. 새로운 목표를 추가해 보세요!</p>
                </motion.div>
              ) : (
                goals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${styles.card} ${goal.completed ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md'}`}
                  >
                    <button 
                      onClick={() => toggleGoal(goal.id)}
                      className={`cursor-pointer transition-colors p-1 rounded-full ${goal.completed ? styles.accent : 'text-slate-300 hover:text-slate-400'}`}
                    >
                      {goal.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                    </button>
                    <span className={`text-lg flex-1 transition-all ${goal.completed ? 'line-through decoration-2 opacity-60' : ''}`}>
                      {goal.text}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Stats */}
        <footer className={`text-center p-4 rounded-2xl ${styles.card} border flex justify-around items-center text-sm`}>
          <div className="flex flex-col">
            <span className="font-bold text-xl">{goals.length}</span>
            <span className="text-slate-500">Toàn bộ</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col">
            <span className={`font-bold text-xl ${styles.accent}`}>
              {goals.filter(g => g.completed).length}
            </span>
            <span className="text-slate-500">Hoàn thành</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col">
            <span className="font-bold text-xl text-orange-500">
              {goals.filter(g => !g.completed).length}
            </span>
            <span className="text-slate-500">Đang làm</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
