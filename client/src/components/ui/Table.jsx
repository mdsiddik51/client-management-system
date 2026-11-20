import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full text-sm', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }) {
  return (
    <thead className={cn('bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800', className)}>
      {children}
    </thead>
  );
}

export function TableHead({ children, className, sortable, sortDir, onSort }) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap',
        sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none',
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && (
          <span className="text-gray-400">
            {sortDir === 'asc' ? (
              <ChevronUp size={12} />
            ) : sortDir === 'desc' ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronsUpDown size={12} />
            )}
          </span>
        )}
      </span>
    </th>
  );
}

export function TableBody({ children, className }) {
  return (
    <tbody className={cn('divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, onClick }) {
  return (
    <tr
      className={cn(
        'transition-colors',
        onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className, ...props }) {
  return (
    <td
      className={cn('px-4 py-3.5 text-gray-700 dark:text-gray-300 whitespace-nowrap', className)}
      {...props}
    >
      {children}
    </td>
  );
}

export default Table;
