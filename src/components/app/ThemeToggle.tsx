import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm rounded-full border border-base-content/10 bg-base-100/30 px-3 hover:border-primary/30 hover:bg-base-100"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4 text-primary" />
          <span className="hidden text-xs text-base-content/70 sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-primary" />
          <span className="hidden text-xs text-base-content/70 sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
