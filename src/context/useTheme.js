import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const FALLBACK = {
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
};

export function useTheme() {
  const context = useContext(ThemeContext);
  // Graceful fallback instead of throwing — prevents ErrorBoundary from catching
  // a transient HMR timing mismatch between Profile.jsx and App.jsx.
  return context ?? FALLBACK;
}
