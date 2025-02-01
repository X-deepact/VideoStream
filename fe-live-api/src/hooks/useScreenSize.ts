import { useEffect, useState } from 'react';

const SM_BREAKPOINT = 576; // Small breakpoint
const MD_BREAKPOINT = 768; // Medium breakpoint
const LG_BREAKPOINT = 992; // Large breakpoint (tablet)
const XL_BREAKPOINT = 1200; // Extra Large breakpoint (desktop)
const XXL_BREAKPOINT = 1400; // Extra Extra Large breakpoint

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<
    'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  >('sm'); // default to small

  useEffect(() => {
    const width = window.innerWidth;
    const onResize = () => {
      if (width < SM_BREAKPOINT && width >= MD_BREAKPOINT) {
        setScreenSize('sm');
      } else if (width >= MD_BREAKPOINT && width < LG_BREAKPOINT) {
        setScreenSize('md');
      } else if (width >= LG_BREAKPOINT && width < XL_BREAKPOINT) {
        setScreenSize('lg');
      } else if (width >= XL_BREAKPOINT && width < XXL_BREAKPOINT) {
        setScreenSize('xl');
      } else if (width >= XXL_BREAKPOINT) {
        setScreenSize('xxl');
      }
    };

    window.addEventListener('resize', onResize);
    onResize();

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return screenSize;
}
