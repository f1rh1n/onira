"use client";

import { useTheme } from '../contexts/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi2';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="glass p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <HiMoon className="w-5 h-5 text-primary-600" />
      ) : (
        <HiSun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
}
