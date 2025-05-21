import { useEffect, useState } from 'react';

export const useScrollSpy = (ids: string[], offset = 0) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + offset;

      const visible = ids.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        return scrollY >= top && scrollY < bottom;
      });

      setActiveId(visible || null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ids, offset]);

  return activeId;
};
