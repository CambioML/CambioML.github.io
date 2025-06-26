import { useEffect, useState, useCallback } from 'react';

export const useWindowScroll = (scrollY: number = 50) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const listenScrollEvent = useCallback(() => {
    window.scrollY > scrollY ? setIsScrolled(true) : setIsScrolled(false);
  }, [scrollY]);

  useEffect(() => {
    window.scrollY > scrollY ? setIsScrolled(true) : setIsScrolled(false);
    window.addEventListener('scroll', listenScrollEvent);
    return () => {
      window.removeEventListener('scroll', listenScrollEvent);
    };
  }, [listenScrollEvent, scrollY]);
  return isScrolled;
};
