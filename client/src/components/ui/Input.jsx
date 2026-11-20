'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helper,
    className,
    id,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={cn(
          'w-full px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 border rounded-lg',
          'text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600',
          'transition-all duration-200 outline-none',
          'focus:ring-2 focus:ring-[#0A84FF]/30 focus:border-[#0A84FF]',
          error
            ? 'border-red-400 dark:border-red-500 focus:ring-red-500/20 focus:border-red-500'
            : 'border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helper}</p>
      )}
    </div>
  );
});

export default Input;
