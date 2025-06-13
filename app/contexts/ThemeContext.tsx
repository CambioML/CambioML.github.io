'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type Theme = 'light' | 'dark' | 'auto';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const pathname = usePathname();

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('cambio-theme') as Theme;
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    }
  }, []);

  // Update resolved theme based on current theme setting and pathname
  useEffect(() => {
    let newResolvedTheme: ResolvedTheme;

    if (theme === 'auto') {
      // Check browser's preferred color scheme
      if (typeof window !== 'undefined') {
        newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        newResolvedTheme = 'light'; // fallback for SSR
      }
    } else {
      newResolvedTheme = theme as ResolvedTheme;
    }

    setResolvedTheme(newResolvedTheme);

    // Apply theme class to document body
    if (typeof window !== 'undefined') {
      document.body.classList.remove('dark', 'light');
      document.body.classList.add(`${newResolvedTheme}`);
    }
  }, [theme, pathname]);

  // Listen for browser color scheme changes when theme is 'auto'
  useEffect(() => {
    if (theme === 'auto' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        const newResolvedTheme: ResolvedTheme = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(newResolvedTheme);

        // Apply theme class to document body
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(`${newResolvedTheme}`);
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cambio-theme', newTheme);
    }
  };

  const toggleTheme = () => {
    if (theme === 'auto') {
      // If currently auto, switch to the opposite of what auto would be
      const browserPrefersDark =
        typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
      setTheme(browserPrefersDark ? 'light' : 'dark');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};
