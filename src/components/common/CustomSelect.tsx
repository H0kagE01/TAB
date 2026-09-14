'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  sublabel?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  enableSearch?: boolean;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  icon,
  className = '',
  label,
  size = 'md',
  align = 'left',
  enableSearch = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options if search is enabled or if list is long
  const showSearch = enableSearch || options.length > 8;
  const filteredOptions = showSearch && filterText
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(filterText.toLowerCase()) ||
          o.sublabel?.toLowerCase().includes(filterText.toLowerCase())
      )
    : options;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFilterText('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setFilterText('');
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const listRef = useRef<HTMLDivElement>(null);

  // Dedicated wheel listener to ensure smooth mouse wheel scrolling inside dropdown
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl || !isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      const atTop = listEl.scrollTop === 0 && e.deltaY < 0;
      const atBottom = listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 1 && e.deltaY > 0;
      if (!atTop && !atBottom) {
        e.preventDefault();
        listEl.scrollTop += e.deltaY;
      }
    };

    listEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => listEl.removeEventListener('wheel', handleWheel);
  }, [isOpen]);


  const [openUpward, setOpenUpward] = useState(false);

  // Check available viewport space on open to prevent screen overflow
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 260 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: 'py-2 px-3 text-xs',
    md: 'py-2.5 px-3.5 text-xs sm:text-sm',
    lg: 'py-3.5 px-4 text-sm sm:text-base',
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8E8276] mb-1.5">
          {label}
        </label>
      )}

      {/* Select Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setFilterText('');
        }}
        className={`w-full flex items-center justify-between gap-2.5 rounded-2xl bg-[#17110E] border transition-all duration-300 cursor-pointer shadow-lg select-none text-left ${
          sizeClasses[size]
        } ${
          isOpen
            ? 'border-[#B88B58] ring-2 ring-[#B88B58]/20 shadow-[0_0_20px_rgba(184,139,88,0.15)] text-white'
            : 'border-white/15 text-[#F7F4EF] hover:border-white/30 hover:bg-[#211915]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          {icon && <span className="text-[#D9A76A] flex-shrink-0">{icon}</span>}
          {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
          <span className="truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? (openUpward ? 0 : 180) : (openUpward ? 180 : 0) }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-[#8E8276]"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      {/* Floating Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.97 }}
            animate={{ opacity: 1, y: openUpward ? -4 : 4, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-[70] min-w-full w-full max-h-56 sm:max-h-64 flex flex-col rounded-2xl bg-[#1A130E] border border-white/20 shadow-2xl p-1.5 backdrop-blur-2xl overflow-hidden ${
              openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            } ${align === 'right' ? 'right-0' : 'left-0'}`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 30px rgba(184, 139, 88, 0.25)',
            }}
          >
            {/* Optional Fast Search if list is long */}
            {showSearch && (
              <div className="flex-shrink-0 p-1.5 pb-2 border-b border-white/10 mb-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8E8276]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Быстрый поиск..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-full rounded-xl bg-black/40 border border-white/10 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-[#8E8276] focus:border-[#B88B58] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Scrollable Items Container with Luxury Gold Scrollbar & min-h-0 for wheel scroll */}
            <div
              ref={listRef}
              onWheel={(e) => {
                e.stopPropagation();
              }}
              className="overflow-y-auto min-h-0 flex-1 overscroll-contain p-0.5 space-y-1 pb-1.5 [scrollbar-width:thin] [scrollbar-color:rgba(184,139,88,0.5)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#B88B58]/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#B88B58]"
            >

              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setFilterText('');
                      }}
                      className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#B88B58] text-[#0E0A08] font-bold shadow-md'
                          : 'text-[#C4B9AD] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 truncate">
                        {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                        <div className="truncate">
                          <span className="truncate block">{option.label}</span>
                          {option.sublabel && (
                            <span
                              className={`text-[10px] block truncate ${
                                isSelected ? 'text-[#0E0A08]/85 font-normal' : 'text-[#8E8276]'
                              }`}
                            >
                              {option.sublabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 text-[#0E0A08] flex-shrink-0 stroke-[2.5]" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-[#8E8276]">
                  Ничего не найдено
                </div>
              )}
            </div>
          </motion.div>

        )}
      </AnimatePresence>
    </div>
  );
}
