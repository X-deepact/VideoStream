import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ModeSwitcher({ label }: { label: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="flex justify-start items-center gap-2 w-full"
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <>
          <MoonIcon className="w-4 h-4" /> Dark
        </>
      ) : (
        <>
          <SunIcon className="w-4 h-4" /> Light
        </>
      )}{' '}
      {label}
    </div>
  );
}
