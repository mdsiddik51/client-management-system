'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export function StatCard({ title, value, change, trend = 'neutral', icon: Icon, description, className }) {
  return (
    <Card className={cn('p-5 flex flex-col justify-between transition-all hover:shadow-md', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {value}
        </div>

        {(change !== undefined || description) && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {change !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center font-medium px-1.5 py-0.5 rounded',
                  trend === 'up' && 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40',
                  trend === 'down' && 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/40',
                  trend === 'neutral' && 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'
                )}
              >
                {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
                {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {trend === 'neutral' && <Minus className="w-3.5 h-3.5 mr-0.5" />}
                {change}
              </span>
            )}
            {description && (
              <span className="text-gray-500 dark:text-gray-400 truncate">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default StatCard;
