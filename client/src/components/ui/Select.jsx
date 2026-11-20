'use client';

import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    helper,
    options = [],
    placeholder,
    className,
    id,
    children,
    ...props
  },
  ref
) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-3.5 py-2.5 pr-10 text-sm bg-white dark:bg-gray-900 border rounded-lg appearance-none cursor-pointer',
            'text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none',
            'focus:ring-2 focus:ring-[#0A84FF]/30 focus:border-[#0A84FF]',
            error
              ? 'border-red-400 dark:border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : 'border-gray-200 dark:border-gray-700',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helper}</p>}
    </div>
  );
});

export default Select;
