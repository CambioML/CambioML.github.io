'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
import { Dropdown, type DropdownItem } from './dropdown';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, isRtlLocale } from '@/lib/i18n';

export interface NavbarTabItem {
  id: string;
  label: string | ReactNode;
  link?: string;
  href?: string;
  content?: ReactNode;
  dropdown?: DropdownItem[];
  columnCount?: number;
}

interface NavbarTabsProps {
  items: NavbarTabItem[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (id: string) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  indicatorClassName?: string;
}

export default function NavbarTabs({
  items,
  defaultTab,
  activeTab,
  onChange,
  className,
  tabClassName,
  activeTabClassName,
  indicatorClassName,
}: NavbarTabsProps) {
  const [localActiveTab, setLocalActiveTab] = useState(defaultTab || items[0]?.id);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });
  const tabsRef = useRef<(HTMLButtonElement | HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get RTL status
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const isRtl = isRtlLocale(currentLocale);

  // Use controlled or uncontrolled active tab
  const currentActiveTab = activeTab !== undefined ? activeTab : localActiveTab;

  // Update indicator position based on hovered or active tab
  const updateIndicatorPosition = useCallback(
    (tabId: string) => {
      const tabIndex = items.findIndex((item) => item.id === tabId);
      if (tabIndex !== -1 && tabsRef.current[tabIndex] && containerRef.current) {
        const tabElement = tabsRef.current[tabIndex];
        if (tabElement) {
          const { offsetLeft, offsetWidth } = tabElement;
          const containerWidth = containerRef.current.offsetWidth;

          // For RTL, calculate position from the right edge
          const position = isRtl ? containerWidth - offsetLeft - offsetWidth : offsetLeft;

          setIndicatorStyle({
            width: offsetWidth,
            left: position,
          });
        }
      }
    },
    [items, isRtl]
  );

  // Update indicator when active tab changes
  useEffect(() => {
    if (!hoveredTab) {
      updateIndicatorPosition(currentActiveTab);
    }
  }, [currentActiveTab, hoveredTab, items, updateIndicatorPosition]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateIndicatorPosition(hoveredTab || currentActiveTab);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentActiveTab, hoveredTab, items, updateIndicatorPosition]);

  const handleTabClick = (id: string) => {
    const item = items.find((item) => item.id === id);

    // Don't handle click for dropdown items
    if (item?.dropdown) {
      return;
    }

    if (item?.link) {
      window.open(item.link, '_blank');
    } else if (item?.href) {
      window.location.href = item.href;
    } else {
      if (activeTab === undefined) {
        setLocalActiveTab(id);
      }
      if (onChange) {
        onChange(id);
      }
    }
  };

  const handleTabMouseEnter = (id: string) => {
    setHoveredTab(id);
    updateIndicatorPosition(id);

    // Close any open dropdown if hovering over a different tab
    const currentItem = items.find((item) => item.id === id);
    if (currentItem?.dropdown) {
      setOpenDropdown(id);
    } else {
      setOpenDropdown(null);
    }
  };

  const handleTabMouseLeave = () => {
    setHoveredTab(null);
    setOpenDropdown(null);
    updateIndicatorPosition(currentActiveTab);
  };

  const handleDropdownItemClick = (item: DropdownItem) => {
    // Close mobile menu if needed and navigate
    console.log('Navigating to:', item.href);
  };

  return (
    <div className={cn(className)}>
      <div className="relative" ref={containerRef} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <div className="flex">
          {items.map((item, index) => {
            if (item.dropdown) {
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    tabsRef.current[index] = el;
                  }}
                  onMouseEnter={() => handleTabMouseEnter(item.id)}
                  onMouseLeave={handleTabMouseLeave}
                >
                  <Dropdown
                    label={item.label as string}
                    items={item.dropdown}
                    isActive={currentActiveTab === item.id}
                    isOpen={openDropdown === item.id}
                    onOpenChange={(isOpen) => setOpenDropdown(isOpen ? item.id : null)}
                    triggerClassName={cn(
                      tabClassName,
                      'rounded-md',
                      currentActiveTab === item.id && activeTabClassName
                    )}
                    onItemClick={handleDropdownItemClick}
                    columnCount={item.columnCount}
                  />
                </div>
              );
            }

            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabsRef.current[index] = el;
                }}
                className={cn(
                  'px-3 md:px-6 py-2 text-xs md:text-sm transition-colors relative z-10 rounded-md whitespace-nowrap',
                  tabClassName,
                  currentActiveTab === item.id
                    ? 'bg-accent text-accent-foreground shadow-strong'
                    : 'text-accent-foreground hover:bg-accent',
                  currentActiveTab === item.id && activeTabClassName
                )}
                onClick={() => handleTabClick(item.id)}
                onMouseEnter={() => handleTabMouseEnter(item.id)}
                onMouseLeave={handleTabMouseLeave}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Animated indicator */}
        <motion.div
          className={cn(
            'absolute bottom-0 h-full rounded-md bg-accent backdrop-blur-sm shadow-soft',
            indicatorClassName
          )}
          initial={false}
          animate={{
            width: indicatorStyle.width,
            x: isRtl ? -indicatorStyle.left : indicatorStyle.left,
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
      </div>
    </div>
  );
}
