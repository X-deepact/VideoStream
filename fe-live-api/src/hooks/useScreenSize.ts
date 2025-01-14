import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768; // Small breakpoint
const TABLET_BREAKPOINT = 1024; // Medium breakpoint (tablet)

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg'>('sm'); // default to small

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setScreenSize('sm');
      } else if (
        window.innerWidth >= MOBILE_BREAKPOINT &&
        window.innerWidth < TABLET_BREAKPOINT
      ) {
        setScreenSize('md');
      } else {
        setScreenSize('lg');
      }
    };

    window.addEventListener('resize', onResize);
    onResize();

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return screenSize;
}
