import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeId, ThemeConfig, THEMES } from '../data/themes';

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'nongkaem888_active_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
      if (saved && THEMES[saved]) return saved;
    } catch {}
    return 'cyber';
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const setThemeId = (id: ThemeId) => {
    if (THEMES[id]) {
      setThemeIdState(id);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, id);
      } catch {}
    }
  };

  const theme = THEMES[themeId] || THEMES.cyber;

  // Apply theme background dynamically to body
  useEffect(() => {
    document.body.style.backgroundColor = theme.bgHex;
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme,
        setThemeId,
        isThemeModalOpen,
        setIsThemeModalOpen
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
