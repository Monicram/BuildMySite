
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-obsidian-800 border border-obsidian-700 text-gold-500 hover:border-gold-600/50 hover:bg-obsidian-700 transition-all duration-300"
    >
      <div className={`absolute transition-all duration-300 transform ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
        <Moon size={20} className="fill-gold-500/20" />
      </div>
      <div className={`absolute transition-all duration-300 transform ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
        <Sun size={20} className="fill-gold-500/20" />
      </div>
    </button>
  );
}
