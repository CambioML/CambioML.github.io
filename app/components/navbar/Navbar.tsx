'use client';

import type React from 'react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavbarTabs, { type NavbarTabItem } from './energent/navbar-tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidingText } from './energent/sliding-text';
import { HamburgerMenu } from './energent/hamburger-menu';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ThemeToggle } from '../ThemeToggle';
import { useTranslation } from '@/lib/use-translation';
import Accordion, { AccordionItem } from './energent/accordion';
import { useIsMobile } from '@/app/hooks/use-mobile';
import { cn } from '@/lib/cn';
import Logo from './Logo';

const HEADER_HEIGHT = 77;

function MobileLink({
  href,
  label,
  onClick,
  isExternal,
  className = '',
}: {
  href: string;
  label: string;
  onClick?: () => void;
  isExternal?: boolean;
  className?: string;
}) {
  const external = Boolean(isExternal || href.startsWith('http'));
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={className}>
      {label}
    </Link>
  );
}

export default function Navbar() {
  const [scrollState, setScrollState] = useState<'hero' | 'transforming' | 'other'>('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [showNavbar, setShowNavbar] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const { t, locale } = useTranslation();

  useEffect(() => {
    setShowNavbar(true);
  }, []);

  // Handle scroll events to determine navbar state
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const next = scrollY < 50 ? 'hero' : 'transforming';
    if (next !== scrollState) setScrollState(next);
  }, [scrollState]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleNavClick = useCallback(() => setIsMenuOpen(false), []);

  const navItems: NavbarTabItem[] = useMemo(
    () => [
      {
        id: 'pricing',
        label: t.nav.pricing,
        href: 'https://app.energent.ai',
        isExternal: true,
      },
      {
        id: 'blog',
        label: t.nav.blog,
        href: `/${locale}/blog`,
      },
      {
        id: 'company',
        label: t.nav.company,
        href: `/${locale}/company/about-us`,
      },
    ],
    [t, locale]
  );

  // Determine active tab based on current route
  useEffect(() => {
    const found = navItems.find((item) => {
      if (item.href && pathname.startsWith(item.href)) return true;
      if (item.dropdown) {
        return item.dropdown.some((sub) => pathname.startsWith(sub.href));
      }
      return false;
    });
    if (found && found.id !== activeTab) {
      setActiveTab(found.id);
    } else if (!found) {
      setActiveTab('');
    }
  }, [pathname, navItems, activeTab]);

  const handleTabChange = useCallback((id: string) => setActiveTab(id), []);

  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {(showNavbar || scrollState !== 'hero') && (
          <motion.header
            className={cn(`w-full z-50`, {
              'absolute top-0 left-0': scrollState === 'hero' && !isMobile,
              'fixed top-0 left-0 right-0 backdrop-blur-lg bg-background/70': scrollState !== 'hero' || isMobile,
              'bg-background/95': isMenuOpen,
            })}
            initial={scrollState === 'hero' ? { opacity: 1 } : { y: -100, opacity: 0 }}
            animate={scrollState === 'hero' ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={scrollState === 'hero' ? { opacity: 1 } : { y: -100, opacity: 0 }}
            key={!isMobile && scrollState === 'hero' ? 'hero-navbar' : 'fixed-navbar'}
          >
            <div className="flex justify-center items-center z-10 w-full">
              <div
                className="container mx-auto px-4 lg:px-6 flex justify-between items-center z-10"
                style={{ height: HEADER_HEIGHT }}
              >
                {/* Logo */}
                <div className="flex items-center flex-shrink-0 gap-3">
                  <Link href="/" className="flex items-center">
                    <Logo />
                  </Link>
                </div>

                {/* Desktop */}
                <div className="hidden lg:flex items-center gap-1 lg:gap-3 flex-shrink-0">
                  <NavbarTabs items={navItems} defaultTab={''} activeTab={activeTab} onChange={handleTabChange} />

                  {/* Buttons */}
                  {/* <div className="flex items-center gap-2 ml-2">
                    <a
                      href={`/${locale}/anyparser`}
                      className="text-sm font-medium px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors whitespace-nowrap"
                    >
                      {t.nav.trySandbox}
                    </a>
                    <a
                      href={`/${locale}/account`}
                      className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
                    >
                      {t.nav.getApiKey}
                    </a>
                  </div> */}

                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>

                {/* Mobile toggle */}
                <div className="flex items-center gap-1 lg:hidden flex-shrink-0">
                  <ThemeToggle />
                  <HamburgerMenu className="" isOpen={isMenuOpen} onToggle={() => setIsMenuOpen((prev) => !prev)} />
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-down panel below the header */}
            <motion.div
              className="fixed inset-x-0 z-50 bg-background border-b border-border"
              style={{
                top: HEADER_HEIGHT,
                maxHeight: `calc(100dvh - ${HEADER_HEIGHT}px)`,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.18 }}
              role="dialog"
              aria-modal="true"
            >
              <nav className="container mx-auto px-4 py-4 space-y-4">
                <div className="flex flex-col gap-2">
                  {navItems.map((item) =>
                    item.dropdown ? (
                      <Accordion key={item.id}>
                        <AccordionItem title={item.label as string}>
                          <div className="flex flex-col gap-2 pl-4">
                            {item.dropdown.map((sub) => (
                              <MobileLink
                                key={sub.id}
                                href={sub.href}
                                label={sub.label}
                                onClick={handleNavClick}
                                className="block py-2 text-lg"
                              />
                            ))}
                          </div>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <MobileLink
                        key={item.id}
                        href={item.link || item.href || '#'}
                        label={item.label as string}
                        isExternal={!!item.link}
                        onClick={handleNavClick}
                        className="block py-2 text-lg font-medium border-b border-border/50"
                      />
                    )
                  )}
                </div>

                {/* <div className="flex flex-col gap-3 pt-4">
                    <a
                      href={`/${locale}/anyparser`}
                      className="w-full text-center py-3 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                    >
                      {t.nav.trySandbox}
                    </a>
                    <a
                      href={`/${locale}/account`}
                      className="w-full text-center py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                    >
                      {t.nav.getApiKey}
                    </a>
                </div> */}

                <div className="border-t border-border py-6 flex flex-col gap-4">
                  <LanguageSwitcher className="w-full" />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
