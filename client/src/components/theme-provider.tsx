import { createContext, useContext } from 'react';
import { useTheme } from '@/hooks/use-theme';

interface ThemeProviderContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeProviderContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
