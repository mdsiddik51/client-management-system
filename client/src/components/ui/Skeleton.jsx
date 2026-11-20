import { cn } from '@/lib/utils';

export function SkeletonLine({ className }) {
  return (
    <div className={cn('h-4 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse', className)} />
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-3', className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-2/3" />
          <SkeletonLine className="w-1/2 h-3" />
        </div>
      </div>
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-4/5" />
      <SkeletonLine className="w-3/5" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLine key={i} className="h-3 flex-1 opacity-70" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="px-4 py-3.5 flex gap-4 border-t border-gray-100 dark:border-gray-800"
        >
          {Array.from({ length: cols }).map((_, col) => (
            <SkeletonLine
              key={col}
              className={cn('flex-1', col === 0 ? 'w-1/3' : '')}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse bg-gray-200 dark:bg-gray-800 rounded', className)} />;
}

export default Skeleton;
